import { Button, TextField, Heading, Card, Flex, Text } from '@radix-ui/themes';
import { useAuthenticateUserMutation } from '../features/shop/userApiSlice';
import { setUser } from '../features/shop/usersSlice';
import { useAppDispatch } from '../app/hooks';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faUser } from '@fortawesome/free-solid-svg-icons';


const Login = () => {
  const [authenticateUser] = useAuthenticateUserMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const {data} = await authenticateUser({ email, password });

      if (data) {
        dispatch(setUser(data.user));
        const prev = document.referrer;
        if (prev.includes('/checkout')) {
          void navigate('/checkout');
        } else {
          void navigate('/shop');
        }
      } else {
        setError('Invalid email or password');
      }
    } catch {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid place-items-center h-[70vh]">
      <Card className="w-full max-w-md mx-4">
        <div className="p-6 sm:p-8">
          <div className="flex flex-col items-center mb-6">
            <div className="bg-blue-800 text-white p-4 rounded-full mb-4">
              <FontAwesomeIcon icon={faUser} size="lg" />
            </div>
            <Heading size="5">Sign in to your account</Heading>
            <Text color="gray" size="2" className="text-center mt-1">
              Enter your credentials to access your account
            </Text>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={(e) => { void handleLogin(e); }} className="space-y-4">
            <div>
              <Text as="label" size="2" weight="medium" className="block mb-1.5">
                Email
              </Text>
              <Flex>
                <div className="flex items-center justify-center bg-gray-100 px-3 rounded-l-md border border-r-0 border-gray-300">
                  <FontAwesomeIcon icon={faUser} className="text-gray-500" />
                </div>
                <TextField.Root 
                  placeholder="you@youremail.com" 
                  value={email} 
                  onChange={(e) => { setEmail(e.target.value); }}
                  className="flex-1 rounded-l-none !border-l-0"
                  required
                />
              </Flex>
            </div>

            <div>
              <Text as="label" size="2" weight="medium" className="block mb-1.5">
                Password
              </Text>
              <Flex>
                <div className="flex items-center justify-center bg-gray-100 px-3 rounded-l-md border border-r-0 border-gray-300">
                  <FontAwesomeIcon icon={faLock} className="text-gray-500" />
                </div>
                <TextField.Root 
                  type="password" 
                  placeholder="Password" 
                  value={password} 
                  onChange={(e) => { setPassword(e.target.value); }}
                  className="flex-1 rounded-l-none !border-l-0"
                  required
                />
              </Flex>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-blue-800 hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>

            <div className="text-center mt-4">
              <Text size="1" color="gray">
                Don't have an account? <Text as="span" color="blue">Create one</Text>
              </Text>
            </div>
          </form>
        </div>
      </Card>
    </div>
  )
}

export default Login