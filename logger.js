import expressWinston from "express-winston"
import winston, { format, transports } from "winston";

export const logWarnings = (expressWinston.logger({

    transports: [
        new transports.File({
            level: "info",
            filename: "logsWarnings.log"
        }),
    ],
    format: format.combine(

        format.json(),
        format.timestamp(),
        format.prettyPrint()

    ),
    statusLevels : true

}))



