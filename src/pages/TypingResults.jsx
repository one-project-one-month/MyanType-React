import { useState, useEffect, useContext, useRef, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { RotateCcw, TrendingUp, Target, Clock, Hash, Home } from "lucide-react";
import ResultsChart from "../components/ResultChart";
import { useTypingTest } from '../context/TypingTestContext';
import { AuthContext } from '../context/AuthProvider';
import { Link, useLocation } from 'react-router-dom';

const TypingResults = ({ onRestart }) => {
  const { results } = useTypingTest();
  const { isLoggedIn } = useContext(AuthContext);
  const location = useLocation();
  const [apiStatus, setApiStatus] = useState({ loading: false, message: '', error: false });
  const hasSentApiRef = useRef(false); // Track if API call has been made

  // Memoize result to prevent unnecessary re-renders
  const result = useMemo(() => {
    return results.length > 0 ? results[results.length - 1] : location.state?.result || null;
  }, [results, location.state?.result]);

  // Log the test mode
  useEffect(() => {
    if (result) {
      console.log('Test Mode:', result.mode?.type || 'Unknown');
    }
  }, [result]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  const getGrade = (wpm) => {
    if (wpm >= 70) return { grade: 'A+', color: 'text-green-400' };
    if (wpm >= 60) return { grade: 'A', color: 'text-green-400' };
    if (wpm >= 50) return { grade: 'B+', color: 'text-blue-400' };
    if (wpm >= 40) return { grade: 'B', color: 'text-blue-400' };
    if (wpm >= 30) return { grade: 'C+', color: 'text-yellow-400' };
    if (wpm >= 20) return { grade: 'C', color: 'text-yellow-400' };
    return { grade: 'D', color: 'text-red-400' };
  };

  const transformResultForAPI = (result) => {
    if (!result) return null;

    if (!result.wpm || !result.accuracy || !result.totalChars) {
      console.error('Missing required result fields:', result);
      return null;
    }

    const consistency = result.intervals && result.intervals.length > 1
      ? Math.round(100 - (Math.max(...result.intervals.map(i => i.wpm)) - Math.min(...result.intervals.map(i => i.wpm))))
      : 100;

    const validMode = ['time', 'words', 'quote'].includes(result.mode?.type?.toLowerCase())
      ? result.mode.type.toLowerCase()
      : 'time';

    const validLanguage = result.language === 'en' ? 'en' : result.language === 'mm' ? 'mm' : 'en';

    const transformedData = {
      wpm: Number(result.wpm) || 0,
      raw: Number(result.wpm) || 0,
      accuracy: Number(result.accuracy) || 0,
      charactersTyped: Number(result.totalChars) || 0,
      correct: Number(result.correctChars) || 0,
      incorrect: Number(result.incorrectChars) || 0,
      extra: Number(result.extra) || 0,
      miss: Number(result.miss) || 0,
      consistency: Number(consistency) || 100,
      timeTaken: Number(result.duration) || 0,
      language: validLanguage,
      mode: validMode,
      timeLimit: Number(result.mode?.type.toLowerCase() === 'time' ? result.mode?.value : 0),
      wordLimit: Number(result.mode?.type.toLowerCase() === 'words' ? result.mode?.value : 0),
    };
    console.log('Original result:', result);
    console.log('Transformed for API:', transformedData);

    return transformedData;
  };

  useEffect(() => {
    if (!result || hasSentApiRef.current) {
      return;
    }

    const sendResultsToAPI = async () => {
      hasSentApiRef.current = true; // Mark API call as sent
      if (result.mode.type.toLowerCase() === 'custom') {
        setApiStatus({ loading: false, message: 'Custom mode results are not saved', error: false });
        return;
      }

      if (!isLoggedIn) {
        setApiStatus({
          loading: false,
          message: 'Guest result (not saved). Please log in to save your results.',
          error: true
        });
        return;
      }

      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        setApiStatus({
          loading: false,
          message: 'No authentication token found. Redirecting to login...',
          error: true
        });
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
        return;
      }

      const transformedResult = transformResultForAPI(result);
      if (!transformedResult) {
        setApiStatus({
          loading: false,
          message: 'Invalid result data. Please try again.',
          error: true
        });
        return;
      }

      setApiStatus({ loading: true, message: 'Saving results...', error: false });

      try {
        console.log('Sending data to API...');
        const response = await fetch('https://myantype-nodejs.onrender.com/api/v1/result', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          credentials: 'include',
          body: JSON.stringify(transformedResult),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('API call failed:', response.status, errorText);

          if (response.status === 401) {
            console.log('Attempting token refresh...');
            const refreshResponse = await fetch('https://myantype-nodejs.onrender.com/api/v1/auth/refresh', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              credentials: 'include',
            });

            if (refreshResponse.ok) {
              const { accessToken: newAccessToken } = await refreshResponse.json();
              console.log('New access token:', newAccessToken.substring(0, 20) + '...');
              localStorage.setItem('accessToken', newAccessToken);

              // Retry API call with new token
              const retryResponse = await fetch('https://myantype-nodejs.onrender.com/api/v1/result', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${newAccessToken}`,
                },
                credentials: 'include',
                body: JSON.stringify(transformedResult),
              });

              if (!retryResponse.ok) {
                throw new Error(`Retry failed: ${await retryResponse.text()}`);
              }

              const data = await retryResponse.json();
              setApiStatus({
                loading: false,
                message: 'Results saved successfully!',
                error: false
              });
              console.log('Results sent successfully:', {
                requestBody: transformedResult,
                response: data,
                timestamp: new Date().toISOString(),
              });
              return;
            } else {
              console.error('Token refresh failed:', await refreshResponse.text());
              setApiStatus({
                loading: false,
                message: 'Failed to refresh authentication token. Please log in again.',
                error: true
              });
              return;
            }
          }

          if (response.status === 500) {
            setApiStatus({
              loading: false,
              message: `Server error: Invalid mode or language. Please ensure mode is 'time', 'words', or 'quote' and language is 'en' or 'mm'.`,
              error: true
            });
            return;
          }

          throw new Error(`Failed to send results: ${errorText}`);
        }

        const data = await response.json();
        setApiStatus({
          loading: false,
          message: 'Results saved successfully!',
          error: false
        });
        console.log('Results sent successfully:', {
          requestBody: transformedResult,
          response: data,
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        console.error('API call error:', error.message);
        setApiStatus({
          loading: false,
          message: 'Failed to save results. Please try again.',
          error: true
        });
      }
    };

    sendResultsToAPI();
  }, [result, isLoggedIn]);

  if (!result) {
    return (
      <div className="max-w-4xl mx-auto text-center py-8 bg-[#0E0F15] border border-white">
        <h2 className="text-3xl font-bold text-blue-400 mb-4">No Results Available</h2>
        <p className="text-slate-400 mb-4">Please complete a typing test to see your results.</p>
        <Button asChild className="flex items-center space-x-2">
          <Link to="/test">
            <RotateCcw size={16} />
            <span>Take a Test</span>
          </Link>
        </Button>
      </div>
    );
  }

  const grade = getGrade(result?.wpm || 0);

  return (
    <div className="max-w-4xl mx-auto bg-[#0E0F15] p-4">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-blue-400 mb-2">Test Results</h2>
        <p className="text-slate-400">
          {result.mode.type === 'time' ? `${result.mode.value} second` : `${result.mode.value} word`} test completed
        </p>
      </div>

      {!isLoggedIn && (
        <div className="text-center mb-4 p-3 bg-yellow-900/20 border border-yellow-400 rounded">
          <p className="text-yellow-400">
            🔒 You are not logged in. Your results won't be saved.
            <Link to="/login" className="underline ml-2 text-blue-400 hover:text-blue-300">
              Log in to save results
            </Link>
          </p>
        </div>
      )}

      {apiStatus.message && (
        <div className={`text-center mb-4 p-2 rounded ${
          apiStatus.error
            ? 'bg-red-900/20 border border-red-400 text-red-400'
            : 'bg-green-900/20 border border-green-400 text-green-400'
        }`}>
          {apiStatus.loading ? (
            <span className="animate-pulse">{apiStatus.message}</span>
          ) : (
            <span>{apiStatus.message}</span>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-[#0E0F15] border border-white">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-sm text-slate-400">Words Per Minute</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-4xl font-bold text-blue-400 mb-1">{result.wpm}</div>
            <div className={`text-lg font-semibold ${grade.color}`}>{grade.grade}</div>
          </CardContent>
        </Card>

        <Card className="bg-[#0E0F15] border border-white">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-sm text-slate-400">Accuracy</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-4xl font-bold text-green-400">{result.accuracy}%</div>
            <div className="text-sm text-slate-400">
              {result.correctChars}/{result.totalChars} chars
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#0E0F15] border border-white">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-sm text-slate-400">Duration</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-4xl font-bold text-yellow-400">{formatTime(result.duration)}</div>
            <div className="text-sm text-slate-400">Total time</div>
          </CardContent>
        </Card>

        <Card className="bg-[#0E0F15] border border-white">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-sm text-slate-400">Words</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-4xl font-bold text-purple-400">{result.wordsCompleted}</div>
            <div className="text-sm text-slate-400">Completed</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="chart" className="mb-8">
        <TabsList className="grid w-full grid-cols-2 bg-[#0E0F15] border border-white">
          <TabsTrigger className="text-gray-500" value="chart">Performance Chart</TabsTrigger>
          <TabsTrigger className="text-gray-500" value="breakdown">Breakdown</TabsTrigger>
        </TabsList>

        <TabsContent value="chart">
          <Card className="bg-[#0E0F15] border border-white">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp size={20} />
                <span className="text-white">Performance Over Time</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResultsChart intervals={result.intervals} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="breakdown">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-[#0E0F15] border border-white">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target size={20} />
                  <span className="text-white">Character Analysis</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Correct Characters</span>
                    <span className="text-green-400 font-semibold">{result.correctChars}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Incorrect Characters</span>
                    <span className="text-red-400 font-semibold">{result.incorrectChars}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total Characters</span>
                    <span className="text-blue-400 font-semibold">{result.totalChars}</span>
                  </div>
                  <div className="w-full bg-[#0E0F15] border border-white rounded-full h-2">
                    <div
                      className="bg-green-400 h-2 rounded-full"
                      style={{ width: `${(result.correctChars / result.totalChars) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#0E0F15] border border-white">
              <CardHeader>
                <CardTitle className="text-white">Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Average WPM</span>
                    <span className="text-blue-400 font-semibold">
                      {result.intervals.length > 0
                        ? Math.round(result.intervals.reduce((sum, i) => sum + i.wpm, 0) / result.intervals.length)
                        : result.wpm}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Peak WPM</span>
                    <span className="text-green-400 font-semibold">
                      {result.intervals.length > 0
                        ? Math.max(...result.intervals.map(i => i.wpm))
                        : result.wpm}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Consistency</span>
                    <span className="text-purple-400 font-semibold">
                      {result.intervals.length > 1
                        ? `${Math.round(100 - (Math.max(...result.intervals.map(i => i.wpm)) - Math.min(...result.intervals.map(i => i.wpm))))}%`
                        : '100%'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-center space-x-4">
        <Button asChild className="flex items-center space-x-2">
          <Link to="/test">
            <RotateCcw size={16} />
            <span>Take Another Test</span>
          </Link>
        </Button>
        <Button asChild className="flex items-center space-x-2">
          <Link to="/">
            <Home size={16} />
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default TypingResults;