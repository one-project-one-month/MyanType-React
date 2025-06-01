import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RotateCcw, TrendingUp, Target, Clock, Hash } from "lucide-react";
import ResultsChart from "../components/ResultChart";
import { useTypingTest } from '../context/TypingTestContext';
import { Link, useLocation } from 'react-router-dom'; // Add useLocation
import { Home, Keyboard, Trophy, Info, User, LogOut } from 'lucide-react';

const TypingResults = ({ onRestart }) => {
  const { results } = useTypingTest();
  const location = useLocation(); // Get navigation state
  const [apiStatus, setApiStatus] = useState({ loading: false, message: '', error: false });

  // Get the latest result from context, or fall back to navigation state
  const result = results.length > 0 ? results[results.length - 1] : location.state?.result || null;

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

    const consistency = result.intervals.length > 1 
      ? Math.round(100 - (Math.max(...result.intervals.map(i => i.wpm)) - Math.min(...result.intervals.map(i => i.wpm))))
      : 100;

    return {
      wpm: result.wpm,
      raw: result.wpm,
      accuracy: result.accuracy,
      charactersTyped: result.totalChars,
      correct: result.correctChars,
      incorrect: result.incorrectChars,
      extra: result.extra || 0,
      miss: result.miss || 0,
      consistency: consistency,
      timeTaken: result.duration,
      language: result.language,
      mode: result.mode.type,
      timeLimit: result.mode.value,
    };
  };

  useEffect(() => {
    const sendResultsToAPI = async (retryCount = 3, delay = 2000) => {
      if (!result) return;

      if (result.mode.type.toLowerCase() === 'custom') {
        setApiStatus({ loading: false, message: 'Custom mode results are not saved to the server.', error: false });
        return;
      }

      const transformedResult = transformResultForAPI(result);
      if (!transformedResult) return;

      setApiStatus({ loading: true, message: 'Sending results...', error: false });

      for (let attempt = 1; attempt <= retryCount; attempt++) {
        try {
          const response = await fetch('https://myantype-nodejs.onrender.com/api/v1/result', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(transformedResult),
          });

          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to send results (Attempt ${attempt}/${retryCount}): ${errorText}`);
          }

          const data = await response.json();
          setApiStatus({ loading: false, error: false });
          console.log('Results sent successfully:', {
            requestBody: transformedResult,
            response: data,
            timestamp: new Date().toISOString(),
          });
          return;
        } catch (error) {
          console.error('Error on attempt', attempt, ':', error.message);
          if (attempt === retryCount) {
            setApiStatus({ loading: false, message: 'Failed to save results after retries.', error: true });
            return;
          }
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    };

    sendResultsToAPI();
  }, [result]);

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

  const grade = getGrade(result.wpm);

  return (
    <div className="max-w-4xl mx-auto bg-[#0E0F15] p-4">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-blue-400 mb-2">Test Results</h2>
        <p className="text-slate-400">
          {result.mode.type === 'time' ? `${result.mode.value} second` : `${result.mode.value} word`} test completed
        </p>
      </div>

      {apiStatus.message && (
        <div className={`text-center mb-4 ${apiStatus.error ? 'text-red-400' : 'text-green-400'}`}>
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