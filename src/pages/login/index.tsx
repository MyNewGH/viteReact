import React, { useEffect, useState } from 'react';
import { Button } from 'antd-mobile';
import { useFetch } from 'use-http';
const index: React.FC = () => {
  const [userInfo, setUserInfo] = useState('');
  const { post, loading, error, response } = useFetch({ data: [] });
  async function login() {}
  return (
    <div>
      <Button onClick={login}>登录</Button>
    </div>
  );
};
export default index;
