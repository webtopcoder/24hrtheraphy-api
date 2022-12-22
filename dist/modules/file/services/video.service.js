"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoService = void 0;
const child_process_1 = require("child_process");
const Ffmpeg = require("fluent-ffmpeg");
const path_1 = require("path");
const kernel_1 = require("../../../kernel");
const exceptions_1 = require("../exceptions");
class VideoService {
    async convert2Mp4(filePath, options = {}) {
        try {
            const fileName = `${kernel_1.StringHelper.randomString(5)}_${kernel_1.StringHelper.getFileName(filePath, true)}.mp4`;
            const toPath = options.toPath || (0, path_1.join)(kernel_1.StringHelper.getFilePath(filePath), fileName);
            return new Promise((resolve, reject) => {
                let outputOptions = '-vcodec libx264 -pix_fmt yuv420p -profile:v baseline -level 3.0 -movflags +faststart -strict experimental -preset fast -threads 0';
                if (options.size) {
                    const sizes = options.size.split('x');
                    const width = sizes[0];
                    const height = sizes.length > 1 ? sizes[1] : '-1  ';
                    outputOptions += ` -vf scale="${width}:${height}"`;
                }
                const command = `ffmpeg -i ${filePath} ${outputOptions} ${toPath}`;
                (0, child_process_1.exec)(command, (err) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve({
                        fileName,
                        toPath
                    });
                });
            });
        }
        catch (e) {
            throw new exceptions_1.ConvertMp4ErrorException(e);
        }
    }
    async getDuration(filePath) {
        return new Promise((resolve, reject) => Ffmpeg.ffprobe(filePath, (err, metadata) => {
            if (err) {
                return reject(err);
            }
            return resolve(parseInt(metadata.format.duration, 10));
        }));
    }
    async createThumbs(filePath, options) {
        let thumbs = [];
        return new Promise((resolve, reject) => new Ffmpeg(filePath)
            .on('filenames', (filenames) => {
            thumbs = filenames;
        })
            .on('end', () => resolve(thumbs))
            .on('error', reject)
            .screenshot({
            folder: options.toFolder,
            filename: `${kernel_1.StringHelper.randomString(5)}-%s.png`,
            count: options.count || 3,
            size: options.size || '320x240'
        }));
    }
}
exports.VideoService = VideoService;
//# sourceMappingURL=video.service.js.map