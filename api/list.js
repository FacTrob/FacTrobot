const { google } = require('googleapis');

module.exports = async (req, res) => {
    try {
        console.log('파일 목록 요청 시작');
        const credentialsRaw = process.env.GOOGLE_CREDENTIALS || '';
        console.log('GOOGLE_CREDENTIALS 길이:', credentialsRaw.length);
        console.log('GOOGLE_CREDENTIALS 처음 50자:', credentialsRaw.substring(0, 50));

        const auth = new google.auth.GoogleAuth({
            credentials: JSON.parse(credentialsRaw),
            scopes: ['https://www.googleapis.com/auth/drive.file'],
        });
        const drive = google.drive({ version: 'v3', auth });

        const response = await drive.files.list({
            q: "'1kHIImPGptcA18Djjp6Wvgg_FWz8pM6-g' in parents",
            fields: 'files(id, name, mimeType, createdTime, owners)',
        });

        console.log('파일 목록 길이:', response.data.files.length);
        console.log('파일 목록:', response.data.files);
        res.status(200).json({ files: response.data.files || [] });
    } catch (error) {
        console.error('목록 가져오기 오류:', error.message, error.stack);
        res.status(500).json({ error: '파일 목록 가져오기 실패', details: error.message });
    }
};  