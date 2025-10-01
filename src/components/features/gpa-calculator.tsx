
"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import { CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, PlusCircle, TrendingUp, BarChart3, Calculator, Eraser } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LabelList } from 'recharts';
import { useIsMobile } from '@/hooks/use-mobile';


type Course = {
    id: number;
    name: string;
    credits: number;
    grade: number;
};

const GradeGauge = ({ gpa }: { gpa: number }) => {
    const percentage = (gpa / 20) * 100;
    const strokeDashoffset = 314 - (percentage / 100) * 314; // Circumference is 2 * PI * 50 = 314

    let colorClass = 'text-yellow-400';
    if (gpa >= 17) colorClass = 'text-green-400';
    else if (gpa < 12) colorClass = 'text-red-500';
    else if (gpa < 14) colorClass = 'text-orange-400';

    return (
        <div className="relative flex items-center justify-center w-48 h-48">
            <svg className="transform -rotate-90" width="192" height="192" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="50" fill="none" stroke="hsl(var(--muted))" strokeWidth="10" />
                <circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray="314"
                    strokeDashoffset={strokeDashoffset}
                    className={cn('transition-all duration-1000 ease-out', colorClass)}
                />
            </svg>
            <div className="absolute flex flex-col items-center">
                <span className={cn("text-5xl font-bold font-display text-glow", colorClass)}>
                    {gpa.toLocaleString('fa-IR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span className="text-sm text-muted-foreground">معدل کل</span>
            </div>
        </div>
    );
};

const GradeDistributionChart = ({ courses }: { courses: Course[] }) => {
    const isMobile = useIsMobile();
    const data = useMemo(() => {
        const excellent = courses.filter(c => c.grade >= 17).length;
        const good = courses.filter(c => c.grade >= 14 && c.grade < 17).length;
        const average = courses.filter(c => c.grade >= 10 && c.grade < 14).length;
        const failed = courses.filter(c => c.grade < 10).length;
        return [
            { name: 'عالی', count: excellent, fill: 'var(--color-green)' },
            { name: 'خوب', count: good, fill: 'var(--color-blue)' },
            { name: 'متوسط', count: average, fill: 'var(--color-orange)' },
            { name: 'ضعیف', count: failed, fill: 'var(--color-red)' },
        ].filter(d => d.count > 0);
    }, [courses]);
    
    if(courses.length === 0) return null;

    return (
        <div className="w-full h-48 mt-4 glass-effect p-2 rounded-xl">
             <style>{`
                :root {
                    --color-green: #22c55e;
                    --color-blue: #3b82f6;
                    --color-orange: #f97316;
                    --color-red: #ef4444;
                }
            `}</style>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                    <XAxis type="number" hide />
                    <YAxis type="category" dataKey="name" hide={isMobile} axisLine={false} tickLine={false} />
                    <Bar dataKey="count" radius={[0, 8, 8, 0]} barSize={isMobile ? 20 : 24}>
                        <LabelList 
                            dataKey="name" 
                            position="insideRight" 
                            offset={8} 
                            className="fill-background font-semibold text-xs" 
                            formatter={(value: string) => {
                                const entry = data.find(d => d.name === value);
                                return entry ? `${value}: ${entry.count}` : value;
                            }}
                        />
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};


export default function GpaCalculator() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [newCourseName, setNewCourseName] = useState('');
    const [newCourseCredits, setNewCourseCredits] = useState('');
    const [newCourseGrade, setNewCourseGrade] = useState('');

     useEffect(() => {
        try {
            const savedCourses = localStorage.getItem('gpaCourses');
            if (savedCourses) {
                setCourses(JSON.parse(savedCourses));
            }
        } catch (e) {
            console.error("Failed to parse courses from localStorage", e);
            localStorage.removeItem('gpaCourses');
        }
    }, []);

    useEffect(() => {
        try {
            localStorage.setItem('gpaCourses', JSON.stringify(courses));
        } catch (e) {
            console.error("Failed to save courses to localStorage", e);
        }
    }, [courses]);

    const handleAddCourse = (e: React.FormEvent) => {
        e.preventDefault();
        const credits = parseFloat(newCourseCredits);
        const grade = parseFloat(newCourseGrade);

        if (newCourseName.trim() && !isNaN(credits) && !isNaN(grade) && credits > 0 && grade >= 0 && grade <= 20) {
            setCourses(prev => [...prev, { id: Date.now(), name: newCourseName.trim(), credits, grade }]);
            setNewCourseName('');
            setNewCourseCredits('');
            setNewCourseGrade('');
        }
    };
    
    const handleClearAll = () => {
        setCourses([]);
    }

    const handleRemoveCourse = (id: number) => {
        setCourses(prev => prev.filter(course => course.id !== id));
    };

    const gpaData = useMemo(() => {
        const totalCredits = courses.reduce((acc, course) => acc + course.credits, 0);
        if (totalCredits === 0) {
            return { gpa: 0, totalCredits: 0 };
        }
        const weightedSum = courses.reduce((acc, course) => acc + (course.grade * course.credits), 0);
        const gpa = weightedSum / totalCredits;
        return { gpa, totalCredits };
    }, [courses]);

    return (
        <CardContent className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                <div className="lg:col-span-2 space-y-4">
                    <form onSubmit={handleAddCourse} className="grid grid-cols-1 sm:grid-cols-[1fr,90px,90px,auto] gap-2 items-end p-3 glass-effect rounded-2xl">
                        <div className="space-y-1"><Label htmlFor="courseName" className="text-xs">نام درس</Label><Input id="courseName" value={newCourseName} onChange={e => setNewCourseName(e.target.value)} placeholder="مثال: ریاضی ۱" /></div>
                        <div className="space-y-1"><Label htmlFor="courseCredits" className="text-xs">تعداد واحد</Label><Input id="courseCredits" type="number" step="0.5" min="0.5" max="6" value={newCourseCredits} onChange={e => setNewCourseCredits(e.target.value)} placeholder="۳" className="text-center" /></div>
                        <div className="space-y-1"><Label htmlFor="courseGrade" className="text-xs">نمره (از ۲۰)</Label><Input id="courseGrade" type="number" step="0.25" min="0" max="20" value={newCourseGrade} onChange={e => setNewCourseGrade(e.target.value)} placeholder="۱۸.۵" className="text-center" /></div>
                        <Button type="submit" size="icon" className="w-full sm:w-10 h-10"><PlusCircle className="w-5 h-5" /></Button>
                    </form>
                    
                    <div className="max-h-80 overflow-y-auto space-y-2 pr-2">
                        {courses.length > 0 ? courses.map((course, index) => (
                            <div key={course.id} className="flex items-center gap-2 p-2 glass-effect rounded-lg animate-in fade-in-0 slide-in-from-top-2 duration-300">
                                <span className="text-sm text-muted-foreground w-6 text-center">{index + 1}.</span>
                                <span className="flex-1 font-semibold">{course.name}</span>
                                <span className="text-xs text-muted-foreground">واحد: <span className="font-mono text-foreground">{course.credits}</span></span>
                                <span className="text-xs text-muted-foreground">نمره: <span className="font-mono text-foreground">{course.grade}</span></span>
                                <Button variant="ghost" size="icon" className="w-8 h-8 text-destructive" onClick={() => handleRemoveCourse(course.id)}><Trash2 className="w-4 h-4" /></Button>
                            </div>
                        )) : (
                             <div className="text-center text-muted-foreground py-10">
                                <p>هنوز درسی اضافه نشده است.</p>
                                <p className="text-xs">برای شروع، اطلاعات اولین درس را وارد کرده و دکمه + را بزنید.</p>
                            </div>
                        )}
                    </div>
                     {courses.length > 0 && <Button variant="outline" size="sm" className="w-full" onClick={handleClearAll}><Eraser className="w-4 h-4 ml-2"/>پاک کردن کل لیست</Button>}
                </div>
                
                <div className="flex flex-col items-center gap-4 glass-effect rounded-2xl p-4 lg:sticky top-24">
                    <GradeGauge gpa={gpaData.gpa} />
                    <div className="text-center">
                        <p className="text-sm text-muted-foreground">مجموع واحدها</p>
                        <p className="text-2xl font-bold font-display">{gpaData.totalCredits.toLocaleString('fa-IR')}</p>
                    </div>
                    <GradeDistributionChart courses={courses} />
                </div>
            </div>
        </CardContent>
    );
}
