const { google } = require('googleapis');

module.exports = async (req, res) => {
    try {
        const auth = new google.auth.GoogleAuth({
            credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS),
            scopes: ['https://www.googleapis.com/auth/drive.file'],
        });
        const drive = google.drive({ version: 'v3', auth });

        const fileId = req.query.fileId;
        if (!fileId) {
            return res.status(400).json({ error: 'fileId가 제공되지 않았습니다.' });
        }

        const fileMetadata = await drive.files.get({ fileId, fields: 'name' });
        const file = await drive.files.get(
            { fileId, alt: 'media' },
            { responseType: 'stream' }
        );

        res.setHeader('Content-Disposition', `attachment; filename="${fileMetadata.data.name}"`);
        res.setHeader('Content-Type', 'application/octet-stream');
        file.data.pipe(res);
    } catch (error) {
        console.error('다운로드 오류:', error);
        res.status(500).json({ error: '다운로드 실패', details: error.message });
    }
};