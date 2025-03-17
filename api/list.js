const { google } = require('googleapis');

module.exports = async (req, res) => {
    try {
        const auth = new google.auth.GoogleAuth({
            credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS),
            scopes: ['https://www.googleapis.com/auth/drive.file'],
        });
        const drive = google.drive({ version: 'v3', auth });

        // 파일목록로딩
        const response = await drive.files.list({
            q: "'me' in owners", // 서비스 계정이 소유한 파일
            fields: 'files(id, name, mimeType, createdTime)',
        });

        res.status(200).json({ files: response.data.files });
    } catch (error) {
        console.error('목록 가져오기 오류:', error);
        res.status(500).json({ error: '파일 목록 가져오기 실패', details: error.message });
    }
};