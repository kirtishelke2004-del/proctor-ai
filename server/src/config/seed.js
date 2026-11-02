const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Test = require('../models/Test');
const ProctorLog = require('../models/ProctorLog');
const connectDB = require('./db');

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    console.log('Clearing existing database collections...');
    await User.deleteMany();
    await Test.deleteMany();
    await ProctorLog.deleteMany();

    console.log('Seeding Users...');
    // Create Admin user
    const adminUser = await User.create({
      username: 'admin',
      email: 'admin@proctorai.com',
      password: 'password123',
      role: 'admin',
    });

    // Create Candidate users
    const candidate1 = await User.create({
      username: 'alex_coder',
      email: 'alex@example.com',
      password: 'password123',
      role: 'candidate',
    });

    const candidate2 = await User.create({
      username: 'priya_dev',
      email: 'priya@example.com',
      password: 'password123',
      role: 'candidate',
    });

    const candidate3 = await User.create({
      username: 'john_doe',
      email: 'john@example.com',
      password: 'password123',
      role: 'candidate',
    });

    console.log('Seeding Tests...');
    const test1 = await Test.create({
      title: 'Full-Stack JavaScript & Algorithms Assessment',
      description: 'Comprehensive test covering array manipulation, two pointers, and string parsing algorithms.',
      durationMinutes: 30,
      createdBy: adminUser._id,
      questions: [
        {
          title: '1. Two Sum Problem',
          description:
            'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume each input has exactly one solution, and you may not use the same element twice.\n\n**Example:**\nInput: nums = [2, 7, 11, 15], target = 9\nOutput: [0, 1]',
          difficulty: 'Easy',
          language: 'javascript',
          starterCode: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}

// Test cases
console.log(twoSum([2, 7, 11, 15], 9)); // Expected: [0, 1]
`,
          testCases: [
            { input: '[2, 7, 11, 15], 9', expectedOutput: '[0, 1]', isSample: true },
            { input: '[3, 2, 4], 6', expectedOutput: '[1, 2]', isSample: false },
          ],
        },
        {
          title: '2. Valid Parentheses',
          description:
            'Given a string `s` containing just the characters `(`, `)`, `{`, `}`, `[` and `]`, determine if the input string is valid.\n\nAn input string is valid if open brackets are closed by the same type of brackets in the correct order.\n\n**Example:**\nInput: s = "()[]{}"\nOutput: true',
          difficulty: 'Medium',
          language: 'javascript',
          starterCode: `/**
 * @param {string} s
 * @return {boolean}
 */
function isValid(s) {
  const stack = [];
  const map = { ')': '(', '}': '{', ']': '[' };
  
  for (const char of s) {
    if (char === '(' || char === '{' || char === '[') {
      stack.push(char);
    } else if (map[char]) {
      if (stack.pop() !== map[char]) return false;
    }
  }
  return stack.length === 0;
}

console.log(isValid("()[]{}")); // Expected: true
`,
          testCases: [
            { input: '"()[]{}"', expectedOutput: 'true', isSample: true },
            { input: '"(]"', expectedOutput: 'false', isSample: false },
          ],
        },
      ],
    });

    const test2 = await Test.create({
      title: 'Python Backend Systems Engineering Assessment',
      description: 'Test focused on data structures, queue design, and memory efficiency.',
      durationMinutes: 45,
      createdBy: adminUser._id,
      questions: [
        {
          title: 'LRU Cache Implementation',
          description: 'Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.',
          difficulty: 'Hard',
          language: 'python',
          starterCode: `class LRUCache:
    def __init__(self, capacity: int):
        self.capacity = capacity
        self.cache = {}

    def get(self, key: int) -> int:
        # Implement LRU lookup
        return self.cache.get(key, -1)

    def put(self, key: int, value: int) -> None:
        # Implement LRU eviction
        self.cache[key] = value
`,
          testCases: [
            { input: 'put(1, 1), put(2, 2), get(1)', expectedOutput: '1', isSample: true },
          ],
        },
      ],
    });

    console.log('Seeding Proctor Logs...');
    // Clean candidate attempt
    const log1 = new ProctorLog({
      userId: candidate1._id,
      testId: test1._id,
      tabSwitchCount: 0,
      fullscreenExitCount: 0,
      cheatScore: 0,
      status: 'submitted',
      violationLogs: [],
      submittedAt: new Date(Date.now() - 3600000),
    });
    await log1.save();

    // Medium suspicion candidate
    const log2 = new ProctorLog({
      userId: candidate2._id,
      testId: test1._id,
      tabSwitchCount: 2,
      fullscreenExitCount: 1,
      status: 'submitted',
      violationLogs: [
        {
          type: 'tab_switch',
          timestamp: new Date(Date.now() - 2500000),
          details: 'Candidate navigated away from browser tab',
          severity: 'medium',
        },
        {
          type: 'fullscreen_exit',
          timestamp: new Date(Date.now() - 1800000),
          details: 'Candidate exited full-screen mode',
          severity: 'medium',
        },
        {
          type: 'tab_switch',
          timestamp: new Date(Date.now() - 900000),
          details: 'Candidate switched tabs again',
          severity: 'medium',
        },
      ],
      submittedAt: new Date(Date.now() - 600000),
    });
    log2.calculateCheatScore();
    await log2.save();

    // High suspicion flagged candidate
    const log3 = new ProctorLog({
      userId: candidate3._id,
      testId: test1._id,
      tabSwitchCount: 5,
      fullscreenExitCount: 3,
      status: 'flagged',
      violationLogs: [
        {
          type: 'tab_switch',
          timestamp: new Date(Date.now() - 4000000),
          details: 'Candidate tab switched to external browser',
          severity: 'medium',
        },
        {
          type: 'fullscreen_exit',
          timestamp: new Date(Date.now() - 3200000),
          details: 'Candidate pressed ESC to leave full screen',
          severity: 'medium',
        },
        {
          type: 'copy_paste',
          timestamp: new Date(Date.now() - 2800000),
          details: 'Candidate attempted large clipboard paste from outside',
          severity: 'high',
        },
        {
          type: 'tab_switch',
          timestamp: new Date(Date.now() - 1500000),
          details: 'Candidate switched tabs during active problem solve',
          severity: 'high',
        },
      ],
      submittedAt: new Date(Date.now() - 1000000),
    });
    log3.calculateCheatScore();
    await log3.save();

    console.log('----------------------------------------------------');
    console.log('Database seeded successfully!');
    console.log('Sample Accounts Created:');
    console.log('Admin:     admin@proctorai.com / password123');
    console.log('Candidate: alex@example.com    / password123');
    console.log('Candidate: priya@example.com   / password123');
    console.log('Candidate: john@example.com    / password123');
    console.log('----------------------------------------------------');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
