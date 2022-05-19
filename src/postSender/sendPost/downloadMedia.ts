import spawn from "await-spawn"
import config from "../../config"
import logger from "../../logger"

/**
 * Downloads media from URL to file using youtube-dl
 * @param url URL to download
 * @returns file path
 * @throws Error if youtube-dl returns with non-zero exit code
 */
export default async function downloadMedia(url: string): Promise<string> {
    const binary = config.get("youtube-dl-binary")
    const filepath = `${new Date().getTime()}.tmp` // Currently downloads to CWD
    logger.info(`Downloading file ${url} to ${filepath} with binary ${binary}`)
    await spawn(binary, ["-o", filepath, url], {
        "stdio": "inherit" // Send child's stdout to parent's stdout
    })
    logger.info(`Downloaded video ${url}`)
    return filepath
}