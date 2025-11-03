// Vercel Serverless Function: 代理 CloudBase SDK
// 这个文件会自动从 CDN 获取 SDK 并返回给浏览器
module.exports = async function handler(req, res) {
  try {
    // 从可靠源获取 SDK
    const sdkUrl = 'https://imgcache.qq.com/qcloud/tcbjs/2.15.0/tcb.umd.min.js';
    const response = await fetch(sdkUrl);
    
    if (!response.ok) {
      // 备用 CDN
      const backupUrl = 'https://cdn.jsdelivr.net/npm/@cloudbase/js-sdk@2.5.1/dist/index.umd.min.js';
      const backupResponse = await fetch(backupUrl);
      
      if (!backupResponse.ok) {
        res.status(500).send('SDK 加载失败');
        return;
      }
      
      const content = await backupResponse.text();
      res.setHeader('Content-Type', 'application/javascript');
      res.setHeader('Cache-Control', 'public, max-age=86400');
      res.status(200).send(content);
      return;
    }
    
    const content = await response.text();
    res.setHeader('Content-Type', 'application/javascript');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.status(200).send(content);
  } catch (error) {
    res.status(500).send('SDK 代理失败: ' + error.message);
  }
}

