const { google } = require('googleapis');
const formidable = require('formidable');
const fs = require('fs');

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const form = new formidable.IncomingForm({
        maxFileSize: 10 * 1024 * 1024, // 10MB 제한
    });

    try {
        console.log('업로드 요청 시작');
        const [fields, files] = await new Promise((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
                if (err) reject(err);
                else resolve([fields, files]);
            });
        });

        if (!files.file || !files.file[0]) {
            console.log('파일 선택 안 됨');
            return res.status(400).json({ error: '파일이 선택되지 않았습니다.' });
        }

        const file = files.file[0];
        console.log('파일 정보:', file.originalFilename, file.filepath);

        // 환경 변수 확인
        const credentialsRaw = process.env.GOOGLE_CREDENTIALS || '';
        console.log('GOOGLE_CREDENTIALS 길이:', credentialsRaw.length);
        console.log('GOOGLE_CREDENTIALS 처음 50자:', credentialsRaw.substring(0, 50));
        if (!credentialsRaw) {
            throw new Error('GOOGLE_CREDENTIALS가 설정되지 않았습니다.');
        }

        const auth = new google.auth.GoogleAuth({
            credentials: JSON.parse(credentialsRaw),
            scopes: ['https://www.googleapis.com/auth/drive.file'],
        });
        const drive = google.drive({ version: 'v3', auth });

        const fileMetadata = {
            name: file.originalFilename || 'unnamed_file',
            parents: ['1kHIImPGptcA18Djjp6Wvgg_FWz8pM6-g'],
        };
        const media = {
            mimeType: file.mimetype || 'application/octet-stream',
            body: fs.createReadStream(file.filepath),
        };

        const response = await drive.files.create({
            resource: fileMetadata,
            media,
            fields: 'id',
        });

        console.log('업로드 성공:', response.data.id);
        res.status(200).json({ file_id: response.data.id });
    } catch (error) {
        console.error('업로드 오류:', error.message, error.stack);
        res.status(500).json({ error: '업로드 실패', details: error.message });
    }
};