import Habit from '../models/Habit.js';
import HabitLog from '../models/HabitLog.js';
import { validationResult } from 'express-validator';
const serialize = (doc) => doc.toJSON();
async function updateStreak(habitId, userId) {
  const logs = await HabitLog.find({ habitId, userId, completed: true }).select('date').sort({ date: -1 });
  const set = new Set(logs.map(x => x.date));
  const today = new Date(); today.setHours(12, 0, 0, 0);
  const key = (d) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  let longest = 0, run = 0;
  for (let i = 3650; i >= 0; i--) {
    const d = new Date(today); d.setDate(d.getDate() - i);
    if (set.has(key(d))) { run++; longest = Math.max(longest, run); } else { run = 0; }
  }
  const cursor = new Date(today);
  if (!set.has(key(cursor))) cursor.setDate(cursor.getDate() - 1);
  let current = 0;
  while (set.has(key(cursor)) && current < 3650) { current++; cursor.setDate(cursor.getDate() - 1); }
  await Habit.findOneAndUpdate({ _id: habitId, userId }, { streak: current, longestStreak: longest });
}
export async function listHabits(req,res){ const habits=await Habit.find({userId:req.user.id,archived:false}).sort({createdAt:-1}); const logs=await HabitLog.find({userId:req.user.id}).sort({date:-1}); res.json({habits:habits.map(serialize),logs:logs.map(serialize)}); }
export async function createHabit(req,res){ const errors=validationResult(req); if(!errors.isEmpty()) return res.status(400).json({message:errors.array()[0].msg}); const habit=await Habit.create({...req.body,userId:req.user.id}); res.status(201).json({habit:serialize(habit)}); }
export async function updateHabit(req,res){ const allowed=['name','category','frequency','goal','reminder','color','icon','startDate']; const updates={}; for(const key of allowed) if(req.body[key]!==undefined) updates[key]=req.body[key]; const habit=await Habit.findOneAndUpdate({_id:req.params.id,userId:req.user.id},updates,{new:true,runValidators:true}); if(!habit)return res.status(404).json({message:'Habit not found.'}); res.json({habit:serialize(habit)}); }
export async function archiveHabit(req,res){ const habit=await Habit.findOneAndUpdate({_id:req.params.id,userId:req.user.id},{archived:true},{new:true}); if(!habit)return res.status(404).json({message:'Habit not found.'}); res.json({habit:serialize(habit)}); }
export async function deleteHabit(req,res){ const habit=await Habit.findOneAndDelete({_id:req.params.id,userId:req.user.id}); if(!habit)return res.status(404).json({message:'Habit not found.'}); await HabitLog.deleteMany({habitId:habit.id,userId:req.user.id}); res.json({message:'Habit deleted.'}); }
export async function toggleLog(req,res){ const {date}=req.body; if(!/^\d{4}-\d{2}-\d{2}$/.test(date||''))return res.status(400).json({message:'A valid date is required (YYYY-MM-DD).'}); const habit=await Habit.findOne({_id:req.params.id,userId:req.user.id}); if(!habit)return res.status(404).json({message:'Habit not found.'}); const existing=await HabitLog.findOne({userId:req.user.id,habitId:habit.id,date}); let completed; if(existing){await existing.deleteOne();completed=false;}else{await HabitLog.create({userId:req.user.id,habitId:habit.id,date,completed:true});completed=true;} await updateStreak(habit.id,req.user.id); const updated=await Habit.findById(habit.id); res.json({completed,habit:serialize(updated)}); }
export async function exportData(req,res){ const habits=await Habit.find({userId:req.user.id}); const logs=await HabitLog.find({userId:req.user.id}); res.json({habits:habits.map(serialize),logs:logs.map(serialize),exportDate:new Date().toISOString()}); }
export async function importData(req,res){ const {habits,logs}=req.body; if(!Array.isArray(habits)||!Array.isArray(logs))return res.status(400).json({message:'Backup must include habits and logs arrays.'}); for(const h of habits){ if(!h.name||typeof h.name!=='string') return res.status(400).json({message:'Backup contains an invalid habit.'}); }
 await Habit.deleteMany({userId:req.user.id}); await HabitLog.deleteMany({userId:req.user.id}); const map=new Map();
 for(const h of habits){ const created=await Habit.create({userId:req.user.id,name:h.name,category:h.category,frequency:h.frequency,goal:h.goal,reminder:h.reminder,color:h.color,icon:h.icon,startDate:h.startDate,archived:Boolean(h.archived)}); if(h.id)map.set(String(h.id),created.id); }
 const validLogs=[]; for(const l of logs){const newHabitId=map.get(String(l.habitId)); if(newHabitId&&/^\d{4}-\d{2}-\d{2}$/.test(l.date||''))validLogs.push({userId:req.user.id,habitId:newHabitId,date:l.date,completed:true,timestamp:l.timestamp?new Date(l.timestamp):new Date()});}
 if(validLogs.length) await HabitLog.insertMany(validLogs,{ordered:false}).catch(()=>{}); res.json({message:'Backup restored.',importedHabits:habits.length,importedLogs:validLogs.length}); }
export async function adminStats(req,res){const [users,habits]=await Promise.all([ (await import('../models/User.js')).default.find().select('name email role createdAt avatar'), Habit.find() ]);res.json({users:users.map(u=>u.toJSON()),habitsCount:habits.length});}
