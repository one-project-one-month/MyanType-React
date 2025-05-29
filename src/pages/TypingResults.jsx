import React, { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Trophy, Star, Award } from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const TypingResults = () => {
  const location = useLocation();

  const defaultResults = {
    wpm: 65,
    accuracy: 92,
    characters: 320,
    correctChars: 295,
    incorrectChars: 25,
    duration: 60,
    mode: "words", // default mode
    timePerChar: {
      data: [
        { second: "0", speed: 62 },
        { second: "30", speed: 67 },
        { second: "60", speed: 64 },
      ],
    },
  };

  // Updated to normalize 'mode' too!
  const normalizeResults = (rawResults) => {
    return {
      wpm: rawResults.wpm || 0,
      accuracy: rawResults.accuracy || 0,
      characters: rawResults.charactersTyped || 0,
      correctChars: rawResults.correct || 0,
      incorrectChars: rawResults.incorrect || 0,
      duration: rawResults.timeTaken || 0,
      mode: (rawResults.mode && rawResults.mode.toLowerCase()) || "words", // ensure mode is present
      timePerChar: rawResults.timePerChar || {
        data: [
          { second: "0", speed: rawResults.wpm || 0 },
          { second: String(Math.floor(rawResults.timeTaken / 2)), speed: rawResults.wpm || 0 },
          { second: String(rawResults.timeTaken), speed: rawResults.wpm || 0 },
        ],
      },
    };
  };

  // Check if using fallback/default results
  const usedDefault = !(location.state && location.state.results);

  // Use provided results if present, otherwise default
  const results = normalizeResults(location.state?.results ?? defaultResults);

  // Send all result data to localhost:8181 when the component mounts
  useEffect(() => {
    if (location.state && location.state.results) {
      const sendData = async () => {
        try {
          const response = await fetch('http://localhost:8181', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(location.state.results), // Send the entire raw results
          });
          if (!response.ok) {
            throw new Error('Failed to send data to localhost:8181');
          }
          console.log('Data sent successfully:', await response.json());
        } catch (error) {
          console.error('Error sending data:', error);
        }
      };
      sendData();
    }
  }, [location.state]);

  const getGrade = (wpm) => {
    if (wpm >= 80) return { grade: "A+", icon: <Trophy className="text-yellow-400" /> };
    if (wpm >= 70) return { grade: "A", icon: <Trophy className="text-yellow-500" /> };
    if (wpm >= 60) return { grade: "B", icon: <Award className="text-blue-500" /> };
    if (wpm >= 50) return { grade: "C", icon: <Star className="text-green-500" /> };
    if (wpm >= 40) return { grade: "D", icon: <Star className="text-orange-500" /> };
    return { grade: "E", icon: <Star className="text-red-500" /> };
  };

  const grade = getGrade(results.wpm);

  const chartConfig = {
    speed: {
      theme: { light: "#60a5fa", dark: "#60a5fa" },
      label: "Speed (WPM)",
    },
  };

  // X Axis Title
  const xAxisLabel =
    results.mode === "words"
      ? "Words"
      : results.mode === "time"
      ? "Time (seconds)"
      : "Value";

  return (
    <div className="bg-[#0E0F15] min-h-screen overflow-y-auto">
      <div className="max-w-5xl mx-auto w-full py-4 md:py-8 px-4 md:px-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-[#F4F4F5]">
          Typing Test Results
        </h1>
        {usedDefault && (
          <div className="text-yellow-400 text-center mb-4">
            No recent test data found. Showing sample results.
          </div>
        )}

        <div className="grid grid-cols-3 gap-6 mb-6">
          <Card className="bg-[#141723] border-[#777C90] h-40">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-sm font-medium text-[#F4F4F5]">Speed</CardTitle>
                <CardDescription className="text-[#777C90]">Words Per Minute</CardDescription>
              </div>
              <Trophy className="h-5 w-5 text-yellow-500" />
            </CardHeader>
            <CardContent className="flex items-center justify-center">
              <div className="text-3xl font-bold text-[#F4F4F5]">{results.wpm} WPM</div>
            </CardContent>
          </Card>

          <Card className="bg-[#141723] border-[#777C90] h-40">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-sm font-medium text-[#F4F4F5]">Accuracy</CardTitle>
                <CardDescription className="text-[#777C90]">Percentage</CardDescription>
              </div>
              <Award className="h-5 w-5 text-blue-500" />
            </CardHeader>
            <CardContent className="flex items-center justify-center">
              <div className="text-3xl font-bold text-[#F4F4F5]">{results.accuracy}%</div>
            </CardContent>
          </Card>

          <Card className="bg-[#141723] border-[#777C90] h-40">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-sm font-medium text-[#F4F4F5]">Grade</CardTitle>
                <CardDescription className="text-[#777C90]">Performance Level</CardDescription>
              </div>
              {grade.icon}
            </CardHeader>
            <CardContent className="flex items-center justify-center">
              <div className="text-3xl font-bold text-[#F4F4F5]">{grade.grade}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <Card className="bg-[#141723] border-[#777C90] p-6">
            <CardHeader>
              <CardTitle className="text-[#F4F4F5]">Speed over {results.mode === 'words' ? 'Words' : results.mode === 'time' ? 'Time' : 'Test'}</CardTitle>
              <CardDescription className="text-[#777C90]">
                Your typing speed during the test (WPM)
              </CardDescription>
            </CardHeader>
            <CardContent className="h-64 p-6">
              <ResponsiveContainer width="100%" height="100%">
                <ChartContainer config={chartConfig}>
                  <LineChart
                    data={results.timePerChar.data}
                    margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
                  >
                    <XAxis
                      dataKey="second"
                      stroke="#777C90"
                      ticks={["0", String(Math.floor(results.duration / 2)), String(results.duration)]}
                      label={{
                        value: xAxisLabel,
                        position: "bottom",
                        fill: "#F4F4F5",
                        offset: 15,
                      }}
                    />
                    <YAxis
                      stroke="#777C90"
                      label={{
                        value: "WPM",
                        angle: -90,
                        position: "insideLeft",
                        fill: "#F4F4F5",
                        offset: 15,
                      }}
                      domain={[Math.max(0, results.wpm - 20), results.wpm + 20]}
                    />
                    <Line
                      type="monotone"
                      dataKey="speed"
                      name="speed"
                      stroke="#60a5fa"
                      strokeWidth={2}
                      dot={true}
                    />
                    <Tooltip content={<ChartTooltipContent />} />
                  </LineChart>
                </ChartContainer>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-[#141723] border-[#777C90]">
            <CardHeader>
              <CardTitle className="text-[#F4F4F5]">Detailed Stats</CardTitle>
              <CardDescription className="text-[#777C90]">
                Complete breakdown of your performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-[#777C90]">
                    <TableHead className="text-[#F4F4F5]">Metric</TableHead>
                    <TableHead className="text-right text-[#F4F4F5]">Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="border-[#777C90]">
                    <TableCell className="text-[#F4F4F5]">Total Characters</TableCell>
                    <TableCell className="text-right text-[#F4F4F5]">{results.characters}</TableCell>
                  </TableRow>
                  <TableRow className="border-[#777C90]">
                    <TableCell className="text-[#F4F4F5]">Correct Characters</TableCell>
                    <TableCell className="text-right text-[#F4F4F5]">{results.correctChars}</TableCell>
                  </TableRow>
                  <TableRow className="border-[#777C90]">
                    <TableCell className="text-[#F4F4F5]">Incorrect Characters</TableCell>
                    <TableCell className="text-right text-[#F4F4F5]">{results.incorrectChars}</TableCell>
                  </TableRow>
                  <TableRow className="border-[#777C90]">
                    <TableCell className="text-[#F4F4F5]">Test Duration</TableCell>
                    <TableCell className="text-right text-[#F4F4F5]">{results.duration} seconds</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex justify-between pb-6">
              <Button
                variant="outline"
                asChild
                className="bg-[#141723] text-[#F4F4F5] border-[#777C90] hover:bg-[#777C90] hover:text-[#F4F4F5]"
              >
                <Link to="/test">Take Another Test</Link>
              </Button>
              <Button
                asChild
                className="bg-[#141723] text-[#F4F4F5] border-[#777C90] hover:bg-[#777C90] hover:text-[#F4F4F5]"
              >
                <Link to="/">Back to Home</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
        <div className="h-16" />
      </div>
    </div>
  );
};

export default TypingResults;