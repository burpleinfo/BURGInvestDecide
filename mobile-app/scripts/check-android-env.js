const { existsSync } = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

function isWindows() {
  return process.platform === 'win32';
}

function resolveDefaultSdkPath() {
  // Expo error message references this default on Windows.
  const localAppData = process.env.LOCALAPPDATA;
  if (localAppData) {
    return path.join(localAppData, 'Android', 'Sdk');
  }
  const userProfile = process.env.USERPROFILE;
  if (userProfile) {
    return path.join(userProfile, 'AppData', 'Local', 'Android', 'Sdk');
  }
  return null;
}

function tryWhereAdb() {
  if (isWindows()) {
    const result = spawnSync('where', ['adb'], { encoding: 'utf8' });
    return {
      ok: result.status === 0,
      output: (result.stdout || result.stderr || '').trim(),
    };
  }

  const result = spawnSync('which', ['adb'], { encoding: 'utf8' });
  return {
    ok: result.status === 0,
    output: (result.stdout || result.stderr || '').trim(),
  };
}

function formatPath(p) {
  return p ? p : '(not set)';
}

function main() {
  const envAndroidHome = process.env.ANDROID_HOME || null;
  const envAndroidSdkRoot = process.env.ANDROID_SDK_ROOT || null;
  const defaultSdkPath = resolveDefaultSdkPath();

  const candidateSdkPaths = [envAndroidSdkRoot, envAndroidHome, defaultSdkPath].filter(Boolean);
  const chosenSdk = candidateSdkPaths.find((p) => existsSync(p)) || (candidateSdkPaths[0] || null);

  const adbFromPath = tryWhereAdb();

  const adbFromSdk = chosenSdk
    ? (isWindows()
        ? path.join(chosenSdk, 'platform-tools', 'adb.exe')
        : path.join(chosenSdk, 'platform-tools', 'adb'))
    : null;

  const hasSdkDir = chosenSdk ? existsSync(chosenSdk) : false;
  const hasAdbInSdk = adbFromSdk ? existsSync(adbFromSdk) : false;
  const ok = adbFromPath.ok || (hasSdkDir && hasAdbInSdk);

  console.log('Android env preflight (Expo / React Native)');
  console.log('-----------------------------------------');
  console.log(`Platform: ${process.platform}`);
  console.log(`ANDROID_HOME: ${formatPath(envAndroidHome)}`);
  console.log(`ANDROID_SDK_ROOT: ${formatPath(envAndroidSdkRoot)}`);
  console.log(`Default SDK path: ${formatPath(defaultSdkPath)}`);
  console.log(`Chosen SDK path: ${formatPath(chosenSdk)}`);
  console.log('');

  if (adbFromPath.ok) {
    console.log('✅ adb is available on PATH');
    console.log(adbFromPath.output ? `   ${adbFromPath.output}` : '');
  } else {
    console.log('❌ adb is NOT available on PATH');
    console.log(adbFromPath.output ? `   ${adbFromPath.output}` : '');
  }

  if (hasSdkDir) {
    console.log('✅ Android SDK directory exists');
  } else {
    console.log('❌ Android SDK directory NOT found');
  }

  if (hasAdbInSdk) {
    console.log(`✅ platform-tools contains adb (${adbFromSdk})`);
  } else {
    console.log('❌ platform-tools/adb not found under chosen SDK path');
  }

  if (ok) {
    console.log('\nAll set for `npm run android` / `npx expo start --android`.');
    process.exit(0);
  }

  console.log('\nNext steps (Windows):');
  console.log('1) Install Android Studio (includes SDK Manager)');
  console.log('   winget install --id Google.AndroidStudio -e --source winget');
  console.log('2) In Android Studio → More Actions → SDK Manager, install:');
  console.log('   - Android SDK Platform-Tools (gives you adb)');
  console.log('   - Android SDK Build-Tools');
  console.log('   - An Android SDK Platform (one recent API level)');
  console.log('3) Set env vars (User scope) in a NEW PowerShell window:');
  console.log('   $sdk = "$env:LOCALAPPDATA\\Android\\Sdk"');
  console.log('   [Environment]::SetEnvironmentVariable("ANDROID_HOME", $sdk, "User")');
  console.log('   [Environment]::SetEnvironmentVariable("ANDROID_SDK_ROOT", $sdk, "User")');
  console.log('   [Environment]::SetEnvironmentVariable("Path", $env:Path + ";$sdk\\platform-tools", "User")');
  console.log('4) Close/reopen terminals, then verify:');
  console.log('   adb --version');

  process.exit(1);
}

main();
