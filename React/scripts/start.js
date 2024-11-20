
const { networkInterfaces } = require('os');
const { execSync } = require('child_process');

const getNetworkAddress = () => {
  const nets = networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      // IPv4이고 내부 네트워크가 아닌 주소를 찾습니다
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  return '0.0.0.0'; // 기본값
};

// 환경 변수 설정
process.env.HOST = getNetworkAddress();
console.log(`Using network address: ${process.env.HOST}`);

// React 개발 서버 시작
execSync('react-scripts start', { stdio: 'inherit' });