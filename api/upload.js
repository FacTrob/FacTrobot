const { google } = require('googleapis');
const formidable = require('formidable');
const fs = require('fs');

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // formidable 설정
    const form = new formidable.IncomingForm({
        maxFileSize: 10 * 1024 * 1024, // 10MB 제한
    });

    try {
        const [fields, files] = await new Promise((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
                if (err) reject(err);
                else resolve([fields, files]);
            });
        });

        if (!files.file || !files.file[0]) {
            return res.status(400).json({ error: '파일이 선택되지 않았습니다.' });
        }

        const file = files.file[0]; // 첫 번째 파일 가져오기

        // 구글 드라이브 인증
        const auth = new google.auth.GoogleAuth({
            credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS),
            scopes: ['https://www.googleapis.com/auth/drive.file'],
        });
        const drive = google.drive({ version: 'v3', auth });


        const fileMetadata = { 
            name: file.originalFilename || 'unnamed_file',
            parents: ['1kHIImPGptcA18Djjp6Wvgg_FWz8pM6-g']};

        const media = {
            mimeType: file.mimetype || 'application/octet-stream',
            body: fs.createReadStream(file.filepath),
        };

        const response = await drive.files.create({
            resource: fileMetadata,
            media,
            fields: 'id', // 반환 필드 지정
        });

        // 성공 응답
        res.status(200).json({ file_id: response.data.id });
    } catch (error) {
        console.error('업로드 오류:', error);
        res.status(500).json({ error: '업로드 실패', details: error.message });
    }
};