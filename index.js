const s3Uploader = require('./s3_uploader')

function getFullLogDir (app, logdir) {
  if (!logdir) {
    logdir = app.config.settings.loggingDirectory || app.config.configPath
  }
  return path.isAbsolute(logdir)
    ? logdir
    : path.join(app.config.configPath, logdir)
}

module.exports = function (app) {
  var plugin = {};

  plugin.id = 'sk-logs-to-aws-s3';
  plugin.name = 'Push SignalK server logs to AWS S3';
  plugin.description = 'This plugin pushes SignalK server logs to the AWS S3 bucket';

  plugin.start = function (options, restartPlugin) {
    // Here we put our plugin logic
    const logDir = getFullLogDir(app);
    app.debug('log will be read from ', logDir);
    s3Uploader(options, logDir, app.debug, app.error)
  };

  plugin.stop = function () {
    // Here we put logic we need when the plugin stops
    app.debug('Plugin stopped');
};

plugin.schema = {
    type: 'object',
    required: ['aws_s3_bucket_name', 'aws_region' ,'aws_access_key_id', 'aws_secret_access_key'],
    properties: {
      aws_s3_bucket_name: {
        type: 'string',
        title: 'AWS S3 bucket name, .e.g. com.exmaple.sk-logs'
      },
      aws_region: {
        type: 'string',
        title: 'AWS Region'
      },
      aws_access_key_id: {
        type: 'string',
        title: 'AWS Access Key ID'
      },
      aws_secret_access_key: {
        type: 'string',
        title: 'AWS Secret Access Key'
      }
    }
  };

  return plugin;
};