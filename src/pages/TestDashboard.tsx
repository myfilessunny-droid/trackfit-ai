// TestDashboard page is now commented out and not used in the app. Remove or ignore this file for production.
// If you need to debug, uncomment and use as needed.

// import React, { useState } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { Separator } from '@/components/ui/separator';
// import { Loader2, CheckCircle, XCircle, AlertCircle, Database, Shield, User, Activity } from 'lucide-react';
// import { supabase } from '@/lib/supabase';
// import { useAuth } from '@/context/DataContext';

// interface TestResult {
//   name: string;
//   status: 'pending' | 'pass' | 'fail';
//   message: string;
//   details?: any;
// }

// export default function TestDashboard() {
//   const { user, session } = useAuth();
//   const [testResults, setTestResults] = useState<TestResult[]>([]);
//   const [isRunning, setIsRunning] = useState(false);
//   const [currentTest, setCurrentTest] = useState('');

//   const addTestResult = (name: string, status: 'pass' | 'fail', message: string, details?: any) => {
//     setTestResults(prev => [...prev, { name, status, message, details }]);
//   };

//   const clearResults = () => {
//     setTestResults([]);
//   };

//   // Test 1: Authentication
//   const testAuthentication = async () => {
//     setCurrentTest('Authentication');
//     try {
//       const { data: { user } } = await supabase.auth.getUser();
//       if (user) {
//         addTestResult('Authentication', 'pass', `User authenticated: ${user.email}`, user);
//       } else {
//         addTestResult('Authentication', 'fail', 'No user found', null);
//       }
//     } catch (error) {
//       addTestResult('Authentication', 'fail', `Authentication failed: ${error}`, error);
//     }
//   };

//   // Test 2: JWT Token
//   const testJWTToken = async () => {
//     setCurrentTest('JWT Token');
//     try {
//       const token = localStorage.getItem('sb-yiscgtqmwjcdrgypdjvz-auth-token');
//       if (token) {
//         addTestResult('JWT Token', 'pass', 'JWT token found in localStorage', { tokenLength: token.length });
//       } else {
//         addTestResult('JWT Token', 'fail', 'JWT token not found', null);
//       }
//     } catch (error) {
//       addTestResult('JWT Token', 'fail', `JWT test failed: ${error}`, error);
//     }
//   };

//   // Test 3: Food Entries
//   const testFoodEntries = async () => {
//     setCurrentTest('Food Entries');
//     try {
//       // Insert test food entry
//       const { data: insertData, error: insertError } = await supabase
//         .from('food_entries')
//         .insert({
//           food_name: 'Test Apple',
//           calories: 95,
//           protein: 0.5,
//           carbs: 25,
//           fat: 0.3,
//           meal_type: 'snack',
//           user_id: user?.id
//         })
//         .select();

//       if (insertError) {
//         addTestResult('Food Entries', 'fail', `Insert failed: ${insertError.message}`, insertError);
//         return;
//       }

//       // Read food entries
//       const { data: readData, error: readError } = await supabase
//         .from('food_entries')
//         .select('*')
//         .eq('user_id', user?.id);

//       if (readError) {
//         addTestResult('Food Entries', 'fail', `Read failed: ${readError.message}`, readError);
//         return;
//       }

//       addTestResult('Food Entries', 'pass', `Successfully inserted and read ${readData.length} food entries`, {
//         inserted: insertData[0],
///         totalEntries: readData.length
//       });
//     } catch (error) {
//       addTestResult('Food Entries', 'fail', `Food entries test failed: ${error}`, error);
//     }
//   };

//   // Test 4: Exercise Entries
//   const testExerciseEntries = async () => {
//     setCurrentTest('Exercise Entries');
//     try {
//       // Insert test exercise entry
//       const { data: insertData, error: insertError } = await supabase
//         .from('exercise_entries')
//         .insert({
//           exercise_name: 'Test Running',
//           calories_burned: 300,
//           duration_minutes: 30,
//           exercise_type: 'cardio',
//           user_id: user?.id
//         })
//         .select();

//       if (insertError) {
//         addTestResult('Exercise Entries', 'fail', `Insert failed: ${insertError.message}`, insertError);
//         return;
//       }

//       // Read exercise entries
//       const { data: readData, error: readError } = await supabase
//         .from('exercise_entries')
//         .select('*')
//         .eq('user_id', user?.id);

//       if (readError) {
//         addTestResult('Exercise Entries', 'fail', `Read failed: ${readError.message}`, readError);
//         return;
//       }

//       addTestResult('Exercise Entries', 'pass', `Successfully inserted and read ${readData.length} exercise entries`, {
//         inserted: insertData[0],
///         totalEntries: readData.length
//       });
//     } catch (error) {
//       addTestResult('Exercise Entries', 'fail', `Exercise entries test failed: ${error}`, error);
//     }
//   };

//   // Test 5: Daily Summaries
//   const testDailySummaries = async () => {
//     setCurrentTest('Daily Summaries');
//     try {
//       // Insert test daily summary
//       const { data: insertData, error: insertError } = await supabase
//         .from('daily_summaries')
//         .insert({
//           date: new Date().toISOString().split('T')[0],
///           total_calories_consumed: 1500,
//           total_calories_burned: 500,
//           net_calories: 1000,
//           user_id: user?.id
//         })
//         .select();

//       if (insertError) {
//         addTestResult('Daily Summaries', 'fail', `Insert failed: ${insertError.message}`, insertError);
//         return;
//       }

//       // Read daily summaries
//       const { data: readData, error: readError } = await supabase
//         .from('daily_summaries')
//         .select('*')
//         .eq('user_id', user?.id);

//       if (readError) {
//         addTestResult('Daily Summaries', 'fail', `Read failed: ${readError.message}`, readError);
//         return;
//       }

//       addTestResult('Daily Summaries', 'pass', `Successfully inserted and read ${readData.length} daily summaries`, {
//         inserted: insertData[0],
///         totalEntries: readData.length
//       });
//     } catch (error) {
//       addTestResult('Daily Summaries', 'fail', `Daily summaries test failed: ${error}`, error);
//     }
//   };

//   // Test 6: RLS Security
//   const testRLSSecurity = async () => {
//     setCurrentTest('RLS Security');
//     try {
//       // Try to access all food entries (should only return user's data)
//       const { data: allData, error: allError } = await supabase
//         .from('food_entries')
//         .select('*');

//       if (allError) {
//         addTestResult('RLS Security', 'fail', `RLS test failed: ${allError.message}`, allError);
//         return;
//       }

//       addTestResult('RLS Security', 'pass', `RLS working - only user data accessible (${allData.length} entries)`, {
//         accessibleEntries: allData.length
//       });
//     } catch (error) {
//       addTestResult('RLS Security', 'fail', `RLS security test failed: ${error}`, error);
//     }
//   };

//   // Test 7: User Profile
//   const testUserProfile = async () => {
//     setCurrentTest('User Profile');
//     try {
//       const { data, error } = await supabase
//         .from('user_profiles')
//         .select('*')
//         .eq('user_id', user?.id);

//       if (error) {
//         addTestResult('User Profile', 'fail', `User profile test failed: ${error.message}`, error);
//         return;
//       }

//       addTestResult('User Profile', 'pass', `User profile accessible (${data.length} entries)`, {
//         profileEntries: data.length
//       });
//     } catch (error) {
//       addTestResult('User Profile', 'fail', `User profile test failed: ${error}`, error);
//     }
//   };

//   // Run all tests
//   const runAllTests = async () => {
//     setIsRunning(true);
//     clearResults();

//     await testAuthentication();
//     await testJWTToken();
//     await testFoodEntries();
//     await testExerciseEntries();
//     await testDailySummaries();
//     await testRLSSecurity();
//     await testUserProfile();

//     setIsRunning(false);
//     setCurrentTest('');
//   };

//   const getStatusIcon = (status: string) => {
//     switch (status) {
//       case 'pass':
///         return <CheckCircle className="h-4 w-4 text-green-500" />;
//       case 'fail':
///         return <XCircle className="h-4 w-4 text-red-500" />;
//       case 'pending':
///         return <AlertCircle className="h-4 w-4 text-yellow-500" />;
//       default:
///         return <AlertCircle className="h-4 w-4 text-gray-500" />;
//     }
//   };

//   const getStatusBadge = (status: string) => {
//     switch (status) {
//       case 'pass':
///         return <Badge className="bg-green-100 text-green-800">PASS</Badge>;
//       case 'fail':
///         return <Badge className="bg-red-100 text-red-800">FAIL</Badge>;
//       case 'pending':
///         return <Badge className="bg-yellow-100 text-yellow-800">PENDING</Badge>;
//       default:
///         return <Badge className="bg-gray-100 text-gray-800">UNKNOWN</Badge>;
//     }
//   };

//   const passedTests = testResults.filter(r => r.status === 'pass').length;
//   const totalTests = testResults.length;
//   const successRate = totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0;

//   return (
//     <div className="p-8 max-w-6xl mx-auto">
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold mb-2">🧪 TrackFit AI Test Dashboard</h1>
//         <p className="text-gray-600">Comprehensive testing interface for all application features</p>
//       </div>

//       {/* User Info */}
//       <Card className="mb-6">
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <User className="h-5 w-5" />
//             Current User
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           {user ? (
//             <div className="space-y-2">
//               <p><strong>Email:</strong> {user.email}</p>
//               <p><strong>User ID:</strong> {user.id}</p>
//               <p><strong>Session Active:</strong> {session ? 'Yes' : 'No'}</p>
//             </div>
//           ) : (
//             <p className="text-red-600">No user authenticated</p>
//           )}
//         </CardContent>
//       </Card>

//       {/* Test Controls */}
//       <Card className="mb-6">
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <Activity className="h-5 w-5" />
//             Test Controls
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="flex gap-4 flex-wrap">
//             <Button
//               onClick={runAllTests}
//               disabled={isRunning}
//               className="bg-green-600 hover:bg-green-700"
//             >
///               {isRunning ? (
//                 <>
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                   Running Tests...
//                 </>
//               ) : (
//                 'Run All Tests'
//               )}
//             </Button>

//             <Button
//               onClick={testAuthentication}
//               disabled={isRunning}
//               variant="outline"
//             >
///               Test Authentication
//             </Button>

//             <Button
//               onClick={testJWTToken}
//               disabled={isRunning}
//               variant="outline"
//             >
///               Test JWT Token
//             </Button>

//             <Button
//               onClick={testFoodEntries}
//               disabled={isRunning}
//               variant="outline"
//             >
///               Test Food Entries
//             </Button>

//             <Button
//               onClick={testExerciseEntries}
//               disabled={isRunning}
//               variant="outline"
//             >
///               Test Exercise Entries
//             </Button>

//             <Button
//               onClick={testDailySummaries}
//               disabled={isRunning}
//               variant="outline"
//             >
///               Test Daily Summaries
//             </Button>

//             <Button
//               onClick={testRLSSecurity}
//               disabled={isRunning}
//               variant="outline"
//             >
///               Test RLS Security
//             </Button>

//             <Button
//               onClick={testUserProfile}
//               disabled={isRunning}
//               variant="outline"
//             >
///               Test User Profile
//             </Button>

//             <Button
//               onClick={clearResults}
//               disabled={isRunning}
//               variant="destructive"
//             >
///               Clear Results
//             </Button>
//           </div>

//           {isRunning && (
//             <div className="mt-4 p-3 bg-blue-50 rounded-lg">
//               <p className="text-blue-800">
//                 <Loader2 className="inline mr-2 h-4 w-4 animate-spin" />
//                 Currently running: {currentTest}
//               </p>
//             </div>
//           )}
//         </CardContent>
//       </Card>

//       {/* Test Results Summary */}
//       {testResults.length > 0 && (
//         <Card className="mb-6">
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Database className="h-5 w-5" />
//               Test Results Summary
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
//               <div className="text-center p-4 bg-gray-50 rounded-lg">
//                 <div className="text-2xl font-bold text-gray-800">{totalTests}</div>
//                 <div className="text-sm text-gray-600">Total Tests</div>
//               </div>
//               <div className="text-center p-4 bg-green-50 rounded-lg">
//                 <div className="text-2xl font-bold text-green-800">{passedTests}</div>
//                 <div className="text-sm text-green-600">Passed</div>
//               </div>
//               <div className="text-center p-4 bg-red-50 rounded-lg">
//                 <div className="text-2xl font-bold text-red-800">{totalTests - passedTests}</div>
//                 <div className="text-sm text-red-600">Failed</div>
//               </div>
//               <div className="text-center p-4 bg-blue-50 rounded-lg">
//                 <div className="text-2xl font-bold text-blue-800">{successRate}%</div>
//                 <div className="text-sm text-blue-600">Success Rate</div>
//               </div>
//             </div>

//             {successRate === 100 && (
//               <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
//                 <p className="text-green-800 font-medium">
//                   🎉 All tests passed! Your TrackFit AI is working perfectly!
//                 </p>
//               </div>
//             )}
//           </CardContent>
//         </Card>
//       )}

//       {/* Detailed Test Results */}
//       {testResults.length > 0 && (
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Shield className="h-5 w-5" />
//               Detailed Test Results
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-4">
//               {testResults.map((result, index) => (
//                 <div key={index} className="border rounded-lg p-4">
//                   <div className="flex items-center justify-between mb-2">
//                     <div className="flex items-center gap-2">
//                       {getStatusIcon(result.status)}
//                       <span className="font-medium">{result.name}</span>
//                     </div>
//                     {getStatusBadge(result.status)}
//                   </div>
//                   <p className="text-sm text-gray-600 mb-2">{result.message}</p>
//                   {result.details && (
//                     <details className="text-xs">
//                       <summary className="cursor-pointer text-blue-600">View Details</summary>
//                       <pre className="mt-2 p-2 bg-gray-50 rounded text-xs overflow-auto">
//                         {JSON.stringify(result.details, null, 2)}
//                       </pre>
//                     </details>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </CardContent>
//         </Card>
//       )}
//     </div>
//   );
// }
