-- Sample Data for Career Assessment Tests
-- This file contains INSERT statements for the tests and questions tables
-- Run this after creating the database schema

-- Insert Tests
INSERT INTO tests (name, description, test_type, duration_minutes, total_questions) VALUES
('Aptitude Explorer', 'Discover your natural abilities in reasoning, problem-solving, and learning styles through fun, real-world scenarios.', 'aptitude', 25, 12),
('Personality Compass', 'Understand your personality traits and how they influence your career choices and work preferences.', 'personality', 20, 15),
('Interest Navigator', 'Explore what activities and subjects excite you most to find career paths that match your passions.', 'interest', 20, 12),
('Skills Inventory', 'Assess your current abilities and strengths in different areas to identify areas for growth.', 'skills', 15, 10),
('Values Compass', 'Identify what matters most to you in work and life to find meaningful career directions.', 'values', 20, 12);

-- Insert Questions for Aptitude Test (ID will be auto-generated, we'll reference by name in comments)
-- Aptitude Test Questions (Logical Reasoning, Math, Verbal, Spatial)
INSERT INTO questions (test_id, question_text, question_type, options, correct_answer, points, order_index) VALUES
((SELECT id FROM tests WHERE name = 'Aptitude Explorer'), 'You have 3 red balls, 4 blue balls, and 2 green balls. If you pick 2 balls at random, what''s the probability of getting one red and one blue?', 'multiple_choice', '["2/9", "1/3", "4/9", "1/2"]', '4/9', 1, 1),
((SELECT id FROM tests WHERE name = 'Aptitude Explorer'), 'Complete the pattern: 2, 4, 8, 16, ?', 'multiple_choice', '["24", "32", "18", "20"]', '32', 1, 2),
((SELECT id FROM tests WHERE name = 'Aptitude Explorer'), 'If all bloops are razzes and some razzes are fizzles, which statement must be true?', 'multiple_choice', '["All bloops are fizzles", "Some bloops are fizzles", "No bloops are fizzles", "All fizzles are bloops"]', 'Some bloops are fizzles', 1, 3),
((SELECT id FROM tests WHERE name = 'Aptitude Explorer'), 'A store sells a shirt for $25 after a 20% discount. What was the original price?', 'multiple_choice', '["$30", "$31.25", "$28.75", "$32.50"]', '$31.25', 1, 4),
((SELECT id FROM tests WHERE name = 'Aptitude Explorer'), 'Which word doesn''t belong with the others?', 'multiple_choice', '["Square", "Circle", "Triangle", "Rectangle"]', 'Circle', 1, 5),
((SELECT id FROM tests WHERE name = 'Aptitude Explorer'), 'If you fold this pattern along the dotted line, which shape will you get?', 'multiple_choice', '["A house", "A boat", "A car", "A plane"]', 'A boat', 1, 6),
((SELECT id FROM tests WHERE name = 'Aptitude Explorer'), 'Find the missing number: 3, 6, 9, 15, 24, ?', 'multiple_choice', '["36", "42", "39", "45"]', '39', 1, 7),
((SELECT id FROM tests WHERE name = 'Aptitude Explorer'), 'Which of these activities would you prefer to do in your free time?', 'multiple_choice', '["Solve a puzzle", "Draw a picture", "Write a story", "Build something with blocks"]', 'Solve a puzzle', 1, 8),
((SELECT id FROM tests WHERE name = 'Aptitude Explorer'), 'If 5 machines can produce 5 widgets in 5 minutes, how long would it take 100 machines to produce 100 widgets?', 'multiple_choice', '["5 minutes", "10 minutes", "15 minutes", "20 minutes"]', '5 minutes', 1, 9),
((SELECT id FROM tests WHERE name = 'Aptitude Explorer'), 'Complete the analogy: Book is to Library as Painting is to:', 'multiple_choice', '["Museum", "Gallery", "Artist", "Frame"]', 'Museum', 1, 10),
((SELECT id FROM tests WHERE name = 'Aptitude Explorer'), 'You have a 7-minute hourglass and an 11-minute hourglass. How can you measure exactly 15 minutes?', 'multiple_choice', '["Start both, flip 7-min when it ends, flip 11-min when 7-min ends again", "Start 11-min, flip 7-min when it ends, wait for 7-min again", "Start 7-min twice and 11-min once", "It''s impossible"]', 'Start both, flip 7-min when it ends, flip 11-min when 7-min ends again', 1, 11),
((SELECT id FROM tests WHERE name = 'Aptitude Explorer'), 'Which shape can be formed by folding this net?', 'multiple_choice', '["Cube", "Pyramid", "Cylinder", "Sphere"]', 'Cube', 1, 12);

-- Personality Test Questions (Big Five traits: Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism)
INSERT INTO questions (test_id, question_text, question_type, options, correct_answer, points, order_index) VALUES
((SELECT id FROM tests WHERE name = 'Personality Compass'), 'When meeting new people at a party, you usually:', 'multiple_choice', '["Stay quiet and observe", "Jump right in and start conversations", "Talk to one or two people you know", "Feel nervous and leave early"]', 'Jump right in and start conversations', 1, 1),
((SELECT id FROM tests WHERE name = 'Personality Compass'), 'When working on a group project, you prefer to:', 'multiple_choice', '["Take charge and organize everyone", "Do your part quietly", "Come up with creative ideas", "Make sure everyone gets along"]', 'Take charge and organize everyone', 1, 2),
((SELECT id FROM tests WHERE name = 'Personality Compass'), 'When you make a mistake, you typically:', 'multiple_choice', '["Get really upset and stressed", "Try to fix it quickly", "Laugh it off and move on", "Blame others or make excuses"]', 'Try to fix it quickly', 1, 3),
((SELECT id FROM tests WHERE name = 'Personality Compass'), 'In your free time, you enjoy:', 'multiple_choice', '["Trying new and unusual activities", "Sticking to familiar hobbies", "Being with lots of friends", "Reading or learning something new"]', 'Trying new and unusual activities', 1, 4),
((SELECT id FROM tests WHERE name = 'Personality Compass'), 'When someone disagrees with you, you:', 'multiple_choice', '["Get defensive and argue", "Listen and consider their point", "Try to find a compromise", "Change your opinion to avoid conflict"]', 'Listen and consider their point', 1, 5),
((SELECT id FROM tests WHERE name = 'Personality Compass'), 'You work best when:', 'multiple_choice', '["You have a clear plan and deadlines", "You can be creative and flexible", "You work with others", "You work alone without interruptions"]', 'You have a clear plan and deadlines', 1, 6),
((SELECT id FROM tests WHERE name = 'Personality Compass'), 'When facing a challenge, you:', 'multiple_choice', '["Feel excited and energized", "Get worried and anxious", "Stay calm and think logically", "Ask others for help"]', 'Feel excited and energized', 1, 7),
((SELECT id FROM tests WHERE name = 'Personality Compass'), 'You prefer teachers who:', 'multiple_choice', '["Are strict and structured", "Are fun and creative", "Care about students personally", "Explain things clearly"]', 'Are fun and creative', 1, 8),
((SELECT id FROM tests WHERE name = 'Personality Compass'), 'When you achieve a goal, you:', 'multiple_choice', '["Celebrate with friends", "Feel satisfied but move on quickly", "Tell everyone about it", "Reflect on what you learned"]', 'Celebrate with friends', 1, 9),
((SELECT id FROM tests WHERE name = 'Personality Compass'), 'You get stressed when:', 'multiple_choice', '["Things are unpredictable", "You have too much to do", "You have to work with difficult people", "You''re alone for too long"]', 'Things are unpredictable', 1, 10),
((SELECT id FROM tests WHERE name = 'Personality Compass'), 'You enjoy activities that involve:', 'multiple_choice', '["Physical challenges", "Helping others", "Solving problems", "Creating things"]', 'Physical challenges', 1, 10),
((SELECT id FROM tests WHERE name = 'Personality Compass'), 'When learning something new, you prefer to:', 'multiple_choice', '["Read about it first", "Try it hands-on", "Watch someone demonstrate", "Discuss it with others"]', 'Try it hands-on', 1, 11),
((SELECT id FROM tests WHERE name = 'Personality Compass'), 'You would rather work in a job where:', 'multiple_choice', '["You can make your own decisions", "You follow clear instructions", "You help people every day", "You work with cutting-edge technology"]', 'You can make your own decisions', 1, 12),
((SELECT id FROM tests WHERE name = 'Personality Compass'), 'When you''re upset, you:', 'multiple_choice', '["Keep it to yourself", "Talk to friends about it", "Try to solve the problem", "Need time alone to calm down"]', 'Talk to friends about it', 1, 13),
((SELECT id FROM tests WHERE name = 'Personality Compass'), 'You admire people who:', 'multiple_choice', '["Are successful and ambitious", "Are kind and helpful", "Are creative and original", "Are reliable and trustworthy"]', 'Are successful and ambitious', 1, 14);

-- Interest Test Questions (RIASEC: Realistic, Investigative, Artistic, Social, Enterprising, Conventional)
INSERT INTO questions (test_id, question_text, question_type, options, correct_answer, points, order_index) VALUES
((SELECT id FROM tests WHERE name = 'Interest Navigator'), 'Which activity sounds most fun to you?', 'multiple_choice', '["Fixing a broken bicycle", "Reading about space exploration", "Drawing or painting", "Organizing a school event"]', 'Fixing a broken bicycle', 1, 1),
((SELECT id FROM tests WHERE name = 'Interest Navigator'), 'In science class, you enjoy:', 'multiple_choice', '["Building models or experiments", "Researching and writing reports", "Creating posters or presentations", "Working in groups to solve problems"]', 'Building models or experiments', 1, 2),
((SELECT id FROM tests WHERE name = 'Interest Navigator'), 'Your favorite subject is:', 'multiple_choice', '["Math/Science", "English/History", "Art/Music", "Physical Education/Social Studies"]', 'Math/Science', 1, 3),
((SELECT id FROM tests WHERE name = 'Interest Navigator'), 'You''d rather spend a weekend:', 'multiple_choice', '["Working on a DIY project", "Visiting a museum or library", "Going to a concert or art show", "Volunteering at a community center"]', 'Working on a DIY project', 1, 4),
((SELECT id FROM tests WHERE name = 'Interest Navigator'), 'When you grow up, you want to:', 'multiple_choice', '["Build or fix things", "Discover new knowledge", "Express yourself creatively", "Help and teach others"]', 'Build or fix things', 1, 5),
((SELECT id FROM tests WHERE name = 'Interest Navigator'), 'You enjoy games that involve:', 'multiple_choice', '["Strategy and planning", "Creativity and imagination", "Teamwork and cooperation", "Competition and leadership"]', 'Strategy and planning', 1, 6),
((SELECT id FROM tests WHERE name = 'Interest Navigator'), 'Your dream job would involve:', 'multiple_choice', '["Working with your hands", "Solving complex problems", "Creating beautiful things", "Leading and persuading others"]', 'Working with your hands', 1, 7),
((SELECT id FROM tests WHERE name = 'Interest Navigator'), 'You prefer to learn by:', 'multiple_choice', '["Doing hands-on activities", "Reading and researching", "Watching videos or demonstrations", "Discussing ideas with others"]', 'Doing hands-on activities', 1, 8),
((SELECT id FROM tests WHERE name = 'Interest Navigator'), 'Which club would you join?', 'multiple_choice', '["Robotics or Science club", "Debate or Model UN", "Art or Drama club", "Student Council or Sports team"]', 'Robotics or Science club', 1, 9),
((SELECT id FROM tests WHERE name = 'Interest Navigator'), 'You get excited about:', 'multiple_choice', '["New inventions and technology", "Learning about different cultures", "Music, art, or literature", "Making a positive impact on others"]', 'New inventions and technology', 1, 10),
((SELECT id FROM tests WHERE name = 'Interest Navigator'), 'Your favorite type of movie is:', 'multiple_choice', '["Action/Adventure", "Documentary", "Animation/Fantasy", "Drama about real people"]', 'Action/Adventure', 1, 11),
((SELECT id FROM tests WHERE name = 'Interest Navigator'), 'You would enjoy a career in:', 'multiple_choice', '["Engineering or trades", "Research or medicine", "Design or entertainment", "Education or social work"]', 'Engineering or trades', 1, 12);

-- Skills Test Questions (Self-assessment of abilities)
INSERT INTO questions (test_id, question_text, question_type, options, correct_answer, points, order_index) VALUES
((SELECT id FROM tests WHERE name = 'Skills Inventory'), 'How good are you at explaining things to others?', 'multiple_choice', '["Not very good", "Okay", "Pretty good", "Excellent"]', 'Pretty good', 1, 1),
((SELECT id FROM tests WHERE name = 'Skills Inventory'), 'How comfortable are you with using computers and technology?', 'multiple_choice', '["Not comfortable", "Somewhat comfortable", "Very comfortable", "I teach others"]', 'Very comfortable', 1, 2),
((SELECT id FROM tests WHERE name = 'Skills Inventory'), 'How well can you work in a team?', 'multiple_choice', '["Struggle with it", "Okay in small groups", "Good team player", "Natural leader"]', 'Good team player', 1, 3),
((SELECT id FROM tests WHERE name = 'Skills Inventory'), 'How creative are you at solving problems?', 'multiple_choice', '["Not very creative", "Sometimes creative", "Usually creative", "Very innovative"]', 'Usually creative', 1, 4),
((SELECT id FROM tests WHERE name = 'Skills Inventory'), 'How organized are you with your schoolwork?', 'multiple_choice', '["Not organized", "Somewhat organized", "Well organized", "Extremely organized"]', 'Well organized', 1, 5),
((SELECT id FROM tests WHERE name = 'Skills Inventory'), 'How good are you at math and numbers?', 'multiple_choice', '["Struggle with math", "Average at math", "Good at math", "Excellent at math"]', 'Good at math', 1, 6),
((SELECT id FROM tests WHERE name = 'Skills Inventory'), 'How well can you express your ideas in writing?', 'multiple_choice', '["Not well", "Okay", "Well", "Very well"]', 'Well', 1, 7),
((SELECT id FROM tests WHERE name = 'Skills Inventory'), 'How physically active and coordinated are you?', 'multiple_choice', '["Not active", "Somewhat active", "Active", "Very athletic"]', 'Active', 1, 8),
((SELECT id FROM tests WHERE name = 'Skills Inventory'), 'How good are you at remembering details and facts?', 'multiple_choice', '["Forget easily", "Remember some things", "Good memory", "Excellent memory"]', 'Good memory', 1, 9),
((SELECT id FROM tests WHERE name = 'Skills Inventory'), 'How patient are you when learning new things?', 'multiple_choice', '["Not patient", "Somewhat patient", "Patient", "Very patient"]', 'Patient', 1, 10);

-- Values Test Questions (Work values and priorities)
INSERT INTO questions (test_id, question_text, question_type, options, correct_answer, points, order_index) VALUES
((SELECT id FROM tests WHERE name = 'Values Compass'), 'What matters most to you in a job?', 'multiple_choice', '["High salary", "Helping others", "Creativity and freedom", "Job security"]', 'Helping others', 1, 1),
((SELECT id FROM tests WHERE name = 'Values Compass'), 'You would rather work:', 'multiple_choice', '["In a big company", "For a small business", "For yourself", "In a non-profit"]', 'For yourself', 1, 2),
((SELECT id FROM tests WHERE name = 'Values Compass'), 'How important is work-life balance to you?', 'multiple_choice', '["Not important", "Somewhat important", "Very important", "Most important thing"]', 'Very important', 1, 3),
((SELECT id FROM tests WHERE name = 'Values Compass'), 'You want your work to:', 'multiple_choice', '["Make a lot of money", "Make the world better", "Let you express yourself", "Give you status and recognition"]', 'Make the world better', 1, 4),
((SELECT id FROM tests WHERE name = 'Values Compass'), 'You prefer jobs that:', 'multiple_choice', '["Are stable and predictable", "Offer adventure and change", "Help people directly", "Involve leadership"]', 'Help people directly', 1, 5),
((SELECT id FROM tests WHERE name = 'Values Compass'), 'Money is:', 'multiple_choice', '["The most important", "Important but not everything", "Less important than happiness", "Not important at all"]', 'Important but not everything', 1, 6),
((SELECT id FROM tests WHERE name = 'Values Compass'), 'You want to work with:', 'multiple_choice', '["Data and systems", "People and ideas", "Things and machines", "Nature and animals"]', 'People and ideas', 1, 7),
((SELECT id FROM tests WHERE name = 'Values Compass'), 'Success means to you:', 'multiple_choice', '["Wealth and possessions", "Recognition from others", "Personal fulfillment", "Making a difference"]', 'Making a difference', 1, 8),
((SELECT id FROM tests WHERE name = 'Values Compass'), 'You would choose a job that:', 'multiple_choice', '["Pays well but is boring", "Pays okay but you love it", "Is prestigious but stressful", "Lets you help your community"]', 'Pays okay but you love it', 1, 9),
((SELECT id FROM tests WHERE name = 'Values Compass'), 'Work should:', 'multiple_choice', '["Be just a job", "Be part of your identity", "Fund your real interests", "Be your passion"]', 'Be your passion', 1, 10),
((SELECT id FROM tests WHERE name = 'Values Compass'), 'You value:', 'multiple_choice', '["Independence", "Teamwork", "Creativity", "Stability"]', 'Independence', 1, 11),
((SELECT id FROM tests WHERE name = 'Values Compass'), 'Your ideal workplace has:', 'multiple_choice', '["Flexible hours", "Clear structure", "Lots of social interaction", "Quiet focus time"]', 'Flexible hours', 1, 12);