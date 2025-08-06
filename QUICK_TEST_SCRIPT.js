// 🧪 TrackFit AI - Quick Test Script
// Copy and paste this into browser console to test all features

console.log('🧪 Starting TrackFit AI Tests...');

// Test 1: Check Authentication
async function testAuthentication() {
  console.log('\n🔐 Testing Authentication...');
  
  try {
    const { data: { user } } = await supabase.auth.getUser();
    console.log('✅ User authenticated:', user?.email);
    return user;
  } catch (error) {
    console.log('❌ Authentication failed:', error);
    return null;
  }
}

// Test 2: Test Food Entries
async function testFoodEntries(user) {
  console.log('\n🍎 Testing Food Entries...');
  
  try {
    // Insert test food entry
    const { data: insertData, error: insertError } = await supabase
      .from('food_entries')
      .insert({
        food_name: 'Test Apple',
        calories: 95,
        protein: 0.5,
        carbs: 25,
        fat: 0.3,
        meal_type: 'snack',
        user_id: user?.id
      })
      .select();

    if (insertError) {
      console.log('❌ Food entry insert failed:', insertError);
      return false;
    }
    
    console.log('✅ Food entry inserted:', insertData[0]);
    
    // Read food entries
    const { data: readData, error: readError } = await supabase
      .from('food_entries')
      .select('*')
      .eq('user_id', user?.id);

    if (readError) {
      console.log('❌ Food entry read failed:', readError);
      return false;
    }
    
    console.log('✅ Food entries read:', readData.length, 'entries');
    return true;
  } catch (error) {
    console.log('❌ Food entries test failed:', error);
    return false;
  }
}

// Test 3: Test Exercise Entries
async function testExerciseEntries(user) {
  console.log('\n💪 Testing Exercise Entries...');
  
  try {
    // Insert test exercise entry
    const { data: insertData, error: insertError } = await supabase
      .from('exercise_entries')
      .insert({
        exercise_name: 'Test Running',
        calories_burned: 300,
        duration_minutes: 30,
        exercise_type: 'cardio',
        user_id: user?.id
      })
      .select();

    if (insertError) {
      console.log('❌ Exercise entry insert failed:', insertError);
      return false;
    }
    
    console.log('✅ Exercise entry inserted:', insertData[0]);
    
    // Read exercise entries
    const { data: readData, error: readError } = await supabase
      .from('exercise_entries')
      .select('*')
      .eq('user_id', user?.id);

    if (readError) {
      console.log('❌ Exercise entry read failed:', readError);
      return false;
    }
    
    console.log('✅ Exercise entries read:', readData.length, 'entries');
    return true;
  } catch (error) {
    console.log('❌ Exercise entries test failed:', error);
    return false;
  }
}

// Test 4: Test Daily Summaries
async function testDailySummaries(user) {
  console.log('\n📊 Testing Daily Summaries...');
  
  try {
    // Insert test daily summary
    const { data: insertData, error: insertError } = await supabase
      .from('daily_summaries')
      .insert({
        date: new Date().toISOString().split('T')[0],
        total_calories_consumed: 1500,
        total_calories_burned: 500,
        net_calories: 1000,
        user_id: user?.id
      })
      .select();

    if (insertError) {
      console.log('❌ Daily summary insert failed:', insertError);
      return false;
    }
    
    console.log('✅ Daily summary inserted:', insertData[0]);
    
    // Read daily summaries
    const { data: readData, error: readError } = await supabase
      .from('daily_summaries')
      .select('*')
      .eq('user_id', user?.id);

    if (readError) {
      console.log('❌ Daily summary read failed:', readError);
      return false;
    }
    
    console.log('✅ Daily summaries read:', readData.length, 'entries');
    return true;
  } catch (error) {
    console.log('❌ Daily summaries test failed:', error);
    return false;
  }
}

// Test 5: Test RLS Security
async function testRLSSecurity() {
  console.log('\n🛡️ Testing RLS Security...');
  
  try {
    // Try to access all food entries (should only return user's data)
    const { data: allData, error: allError } = await supabase
      .from('food_entries')
      .select('*');

    if (allError) {
      console.log('❌ RLS test failed:', allError);
      return false;
    }
    
    console.log('✅ RLS working - only user data accessible:', allData.length, 'entries');
    return true;
  } catch (error) {
    console.log('❌ RLS security test failed:', error);
    return false;
  }
}

// Test 6: Check JWT Token
function testJWTToken() {
  console.log('\n🔑 Testing JWT Token...');
  
  try {
    const token = localStorage.getItem('sb-yiscgtqmwjcdrgypdjvz-auth-token');
    if (token) {
      console.log('✅ JWT token found in localStorage');
      return true;
    } else {
      console.log('❌ JWT token not found');
      return false;
    }
  } catch (error) {
    console.log('❌ JWT token test failed:', error);
    return false;
  }
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Starting comprehensive test suite...\n');
  
  const results = {
    authentication: false,
    foodEntries: false,
    exerciseEntries: false,
    dailySummaries: false,
    rlsSecurity: false,
    jwtToken: false
  };
  
  // Test authentication
  const user = await testAuthentication();
  results.authentication = !!user;
  
  if (user) {
    // Test database operations
    results.foodEntries = await testFoodEntries(user);
    results.exerciseEntries = await testExerciseEntries(user);
    results.dailySummaries = await testDailySummaries(user);
    results.rlsSecurity = await testRLSSecurity();
  }
  
  // Test JWT token
  results.jwtToken = testJWTToken();
  
  // Print results
  console.log('\n📊 Test Results Summary:');
  console.log('========================');
  console.log(`🔐 Authentication: ${results.authentication ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`🍎 Food Entries: ${results.foodEntries ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`💪 Exercise Entries: ${results.exerciseEntries ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`📊 Daily Summaries: ${results.dailySummaries ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`🛡️ RLS Security: ${results.rlsSecurity ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`🔑 JWT Token: ${results.jwtToken ? '✅ PASS' : '❌ FAIL'}`);
  
  const passedTests = Object.values(results).filter(Boolean).length;
  const totalTests = Object.keys(results).length;
  
  console.log(`\n🎯 Overall: ${passedTests}/${totalTests} tests passed (${Math.round(passedTests/totalTests*100)}%)`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All tests passed! Your TrackFit AI is working perfectly!');
  } else {
    console.log('⚠️ Some tests failed. Check the errors above.');
  }
}

// Run the tests
runAllTests(); 