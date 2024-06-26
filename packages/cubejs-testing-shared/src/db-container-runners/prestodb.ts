import { GenericContainer, Wait } from 'testcontainers';

import { DbRunnerAbstract, DBRunnerContainerOptions } from './db-runner.abstract';

export class PrestoDbRunner extends DbRunnerAbstract {
  public static startContainer(options: DBRunnerContainerOptions) {
    const version = process.env.TEST_PRESTO_VERSION || options.version || '0.281';

    const container = new GenericContainer(`ahanaio/prestodb-sandbox:${version}`)
      .withExposedPorts(8080)
      .withWaitStrategy(Wait.forLogMessage('======== SERVER STARTED ========'))
      .withStartupTimeout(30 * 1000);

    if (options.volumes) {
      // eslint-disable-next-line no-restricted-syntax
      for (const { source, target, bindMode } of options.volumes) {
        container.withBindMount(source, target, bindMode);
      }
    }

    return container.start();
  }
}
