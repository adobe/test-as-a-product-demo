#!/usr/bin/env node

/**
 * This script enhances Mochawesome reports with step-level details from Cucumber JSON
 */

const fs = require('fs');
const path = require('path');

const CUCUMBER_REPORT = path.join(__dirname, '../reports/cucumber/cucumber-report.json');
const MOCHAWESOME_DIR = path.join(__dirname, '../reports/mochawesome');
const ENHANCED_REPORT = path.join(__dirname, '../reports/enhanced-test-report.json');
const CYPRESS_E2E_DIR = path.join(__dirname, '../cypress/e2e');

function loadJSON(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error.message);
    return null;
  }
}

function findMochawesomeReports() {
  try {
    const files = fs.readdirSync(MOCHAWESOME_DIR);
    return files
      .filter(f => f.endsWith('.json'))
      .map(f => path.join(MOCHAWESOME_DIR, f));
  } catch (error) {
    return [];
  }
}

function extractStackTraces(mochawesomeReports) {
  const stackTraces = {};
  
  mochawesomeReports.forEach(reportPath => {
    const report = loadJSON(reportPath);
    if (!report || !report.results) return;
    
    report.results.forEach(result => {
      result.suites?.forEach(suite => {
        suite.tests?.forEach(test => {
          if (test.fail && test.err) {
            // Use the full title as the key
            const testName = test.fullTitle || test.title;
            stackTraces[testName] = {
              message: test.err.message,
              stack: test.err.estack,
              rawStack: test.err.estack
            };
          }
        });
      });
    });
  });
  
  return stackTraces;
}

function buildCallStack(filePath, startLine, endLine, depth = 0, visited = new Set()) {
  if (depth > 5) return []; // Prevent infinite recursion
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    const callStack = [];
    
    // Look for function calls (0-indexed)
    for (let i = startLine - 1; i < Math.min(endLine, lines.length); i++) {
      const line = lines[i];
      const trimmedLine = line.trim();
      
      // Match function calls
      const matches = line.match(/\b([a-zA-Z_]\w+)\s*\(/g);
      if (matches) {
        matches.forEach(match => {
          const funcName = match.replace(/\s*\($/, '');
          
          // Filter out Cypress commands and keywords
          if (funcName && !['cy', 'should', 'get', 'within', 'contains', 'invoke', 'Then', 'When', 'Given', 'And', 'expect', 'assert'].includes(funcName)) {
            
            // Avoid visiting the same function twice
            if (!visited.has(funcName)) {
              visited.add(funcName);
              
              // Find the function definition
              const funcDef = findFunctionDefinition(funcName);
              
              if (funcDef) {
                const entry = {
                  functionName: funcName,
                  file: funcDef.file,
                  line: funcDef.line,
                  calledFrom: filePath.replace(path.join(__dirname, '../cypress') + '/', ''),
                  calledFromLine: i + 1,
                  depth: depth
                };
                
                // Recursively build call stack for nested calls
                if (funcDef.fullPath && funcDef.line && funcDef.endLine) {
                  entry.nestedCalls = buildCallStack(
                    funcDef.fullPath,
                    funcDef.line,
                    funcDef.endLine,
                    depth + 1,
                    visited
                  );
                }
                
                callStack.push(entry);
              }
            }
          }
        });
      }
    }
    
    return callStack;
  } catch (error) {
    return [];
  }
}

function findFunctionDefinition(functionName, searchDir = null) {
  try {
    const searchDirs = searchDir ? [searchDir] : [
      path.join(__dirname, '../cypress/support'),
      path.join(__dirname, '../cypress/e2e')
    ];
    
    for (const dir of searchDirs) {
      const result = searchInDirectory(dir, functionName);
      if (result) return result;
    }
    
    return null;
  } catch (error) {
    return null;
  }
}

function searchInDirectory(dir, functionName) {
  try {
    const files = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const file of files) {
      const fullPath = path.join(dir, file.name);
      
      if (file.isDirectory()) {
        const result = searchInDirectory(fullPath, functionName);
        if (result) return result;
      } else if (file.name.endsWith('.js') || file.name.endsWith('.ts')) {
        const content = fs.readFileSync(fullPath, 'utf8');
        const lines = content.split('\n');
        
        for (let index = 0; index < lines.length; index++) {
          const line = lines[index];
          // Look for function definitions
          if (line.match(new RegExp(`\\bfunction\\s+${functionName}\\s*\\(`)) ||
              line.match(new RegExp(`\\bconst\\s+${functionName}\\s*=`)) ||
              line.match(new RegExp(`\\blet\\s+${functionName}\\s*=`))) {
            
            // Find the end of the function
            let endLine = index + 50; // Default range
            let braceCount = 0;
            let foundStart = false;
            
            for (let i = index; i < lines.length && i < index + 100; i++) {
              const l = lines[i];
              for (const char of l) {
                if (char === '{') {
                  braceCount++;
                  foundStart = true;
                } else if (char === '}') {
                  braceCount--;
                  if (foundStart && braceCount === 0) {
                    endLine = i;
                    break;
                  }
                }
              }
              if (foundStart && braceCount === 0) break;
            }
            
            return {
              file: fullPath.replace(path.join(__dirname, '../cypress') + '/', ''),
              line: index + 1,
              endLine: endLine + 1,
              fullPath: fullPath,
              functionName: functionName,
              content: lines.slice(index, Math.min(endLine + 1, lines.length))
            };
          }
        }
      }
    }
    
    return null;
  } catch (error) {
    return null;
  }
}

function findStepDefinition(stepKeyword, stepName) {
  try {
    // Normalize the step name to match the pattern in code
    // "The article with the title "X" should..." -> "The article with the title {string} should..."
    const normalizedStep = stepName.replace(/"[^"]*"/g, '{string}');
    
    // Search for step definitions in all .spec.js files
    function searchInFiles(dir) {
      const results = [];
      const files = fs.readdirSync(dir, { withFileTypes: true });
      
      for (const file of files) {
        const fullPath = path.join(dir, file.name);
        
        if (file.isDirectory()) {
          results.push(...searchInFiles(fullPath));
        } else if (file.name.endsWith('.spec.js')) {
          const content = fs.readFileSync(fullPath, 'utf8');
          const lines = content.split('\n');
          
          // Look for step definition pattern: Then("The article with the title {string}...", 
          lines.forEach((line, index) => {
            // Check if line starts with the step keyword
            if (line.trim().startsWith(stepKeyword + '(')) {
              // Check if the next line or this line contains the step text
              const nextLine = lines[index + 1] || '';
              const combinedLine = (line + nextLine).replace(/\s+/g, ' ');
              
              // Match the step text (allowing for {string} placeholders)
              if (combinedLine.includes(normalizedStep)) {
                // Find the closing brace to determine the end of the function
                let endLine = index + 20; // Default range
                for (let i = index; i < lines.length; i++) {
                  if (lines[i].trim() === ');' || lines[i].trim().startsWith(');')) {
                    endLine = i;
                    break;
                  }
                }
                
                // Build call stack from the step definition
                const callStack = buildCallStack(fullPath, index + 1, endLine);
                
                results.push({
                  file: fullPath.replace(CYPRESS_E2E_DIR + '/', ''),
                  line: index + 1,
                  fullPath: fullPath,
                  content: line.trim(),
                  callStack: callStack
                });
              }
            }
          });
        }
      }
      
      return results;
    }
    
    const matches = searchInFiles(CYPRESS_E2E_DIR);
    return matches.length > 0 ? matches[0] : null;
  } catch (error) {
    console.error('Error finding step definition:', error.message);
  }
  
  return null;
}

function flattenCallStack(nestedStack, result = []) {
  nestedStack.forEach(call => {
    // Recursively add nested calls first (deepest first)
    if (call.nestedCalls && call.nestedCalls.length > 0) {
      flattenCallStack(call.nestedCalls, result);
    }
    
    // Then add the current call
    result.push({
      functionName: call.functionName,
      file: call.file,
      line: call.line
    });
  });
  
  return result;
}

function extractFailedSteps(cucumberReport) {
  const failedSteps = [];
  
  cucumberReport.forEach(feature => {
    feature.elements?.forEach(scenario => {
      scenario.steps?.forEach(step => {
        if (step.result?.status === 'failed') {
          const stepDef = findStepDefinition(step.keyword.trim(), step.name);
          
          // Build Java-style call stack (error at top, step definition at bottom)
          let callStack = [];
          
          if (stepDef?.callStack) {
            // Flatten nested calls (already in deepest-first order)
            callStack = flattenCallStack(stepDef.callStack);
            
            // Add step definition at the end (bottom of stack)
            if (stepDef.file && stepDef.line) {
              const stepDefSignature = `${step.keyword.trim()}("${step.name.replace(/"/g, '\\"')}",(...)=>...)`;
              callStack.push({
                functionName: stepDefSignature,
                file: stepDef.file,
                line: stepDef.line
              });
            }
          }
          
          failedSteps.push({
            featureFile: feature.uri,
            testName: `${feature.name}.${step.keyword.trim()} ${scenario.name}`,
            stepName: step.name,
            callStack: callStack,
            errorMessage: step.result.error_message,
            duration: step.result.duration
          });
        }
      });
    });
  });
  
  return failedSteps;
}

function enhanceReport() {
  console.log('📊 Enhancing test reports with step-level details...\n');
  
  // Load Cucumber report
  const cucumberReport = loadJSON(CUCUMBER_REPORT);
  if (!cucumberReport) {
    console.error('❌ Could not load Cucumber report');
    return;
  }
  
  // Extract failed steps
  const failedSteps = extractFailedSteps(cucumberReport);
  
  if (failedSteps.length === 0) {
    console.log('✅ No failed tests found!\n');
    return;
  }
  
  console.log(`❌ Found ${failedSteps.length} failed step(s):\n`);
  
  failedSteps.forEach((step, index) => {
    console.log(`${index + 1}. Test: ${step.testName}`);
    console.log(`   Step: ${step.stepName}`);
    console.log(`   📁 Feature: ${step.featureFile}`);
    console.log(`   ❌ Error: ${step.errorMessage}\n`);
    
    if (step.callStack && step.callStack.length > 0) {
      console.log(`   📚 Call Stack (Java-style - error at top):`);
      step.callStack.forEach((call) => {
        console.log(`      at ${call.functionName}(${call.file}:${call.line})`);
      });
    }
    
    console.log(`\n   ⏱  Duration: ${(step.duration / 1e9).toFixed(2)}s`);
    console.log('');
  });
  
  // Save enhanced report
  const enhancedReport = {
    timestamp: new Date().toISOString(),
    summary: {
      totalFailed: failedSteps.length
    },
    failedSteps: failedSteps
  };
  
  fs.writeFileSync(ENHANCED_REPORT, JSON.stringify(enhancedReport, null, 2));
  console.log(`📄 Enhanced report saved to: ${ENHANCED_REPORT}\n`);
}

// Run the enhancement
enhanceReport();
