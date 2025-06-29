import app from "../src";
import config from "../src/config/config";
import { logger } from "../src/utils/logger";

const port = config.port;
app.listen(port, () => {
  logger.info(`Server on port ${port}`);
});
