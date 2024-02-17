import {exec} from 'node:child_process';
import Colors from 'colors';

function isNumber(maybeNum: any): maybeNum is number {
  return !isNaN(+maybeNum);
}

function logError(error: Error | string) {
  console.log(Colors.red('error') + ' ' + error.toString());
}

function logInfo(info: string) {
  console.log(Colors.cyan('info') + ' ' + info.toString());
}

function judgeHasDevices() {
  return new Promise<boolean>((res, rej) => {
    const cilld = exec('adb devices', (error, stdout, stderr) => {
      if (error) {
        rej(error);
        return;
      }
      const devices = stdout
        .toString()
        .split('\r\n')
        .filter(line => !!line);
      res(devices.length > 1);
    });
  });
}

export default async function (ports: number[]) {
  const validPorts: number[] = [];
  ports.forEach(port => {
    if (isNumber(port)) {
      validPorts.push(port);
    } else {
      logError(`${port} is not a valid port`);
    }
  });
  try {
    const hasDevices = await judgeHasDevices();
    const command = validPorts
      .map(
        port =>
          `adb ${
            hasDevices ? '' : 'wait-for-device '
          }reverse tcp:${port} tcp:${port}`,
      )
      .join(' && ');
    exec(command, (error, stdout, stderr) => {
      if (error) {
        logError(error);
        return;
      }
      if (stderr) {
        logError(stderr);
        return;
      }
      logInfo(`port [${validPorts.join(', ')}] have been reverse`);
    });
  } catch (error) {
    logError(error);
  }
}
