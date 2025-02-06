import ffmpeg from 'fluent-ffmpeg'
import path from 'path'

export const generateThumbnail = async (videoPath, outputPath) => {
    return new Promise((resolve, reject) => {
        ffmpeg(videoPath).screenshot({
            timestamps: ['5%'],
            filename: "thumbnail.png",
            folder: outputPath,
            size: '320x180'
        }).on('end', () => resolve(path.join(outputPath, 'thumbnail.png')))
            .on('error', (err) => reject(err));
    })
}

