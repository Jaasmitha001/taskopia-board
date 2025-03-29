
import { addDays, format, isAfter, isBefore, isToday, parseISO } from 'date-fns';

export const formatDate = (date: string): string => {
  return format(parseISO(date), 'MMM dd, yyyy');
};

export const isOverdue = (deadline: string): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const deadlineDate = parseISO(deadline);
  return isBefore(deadlineDate, today);
};

export const isApproaching = (deadline: string): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const deadlineDate = parseISO(deadline);
  const twoDaysFromNow = addDays(today, 2);
  
  return (
    !isBefore(deadlineDate, today) && 
    !isAfter(deadlineDate, twoDaysFromNow)
  );
};

export const getDeadlineStatus = (deadline: string): 'overdue' | 'approaching' | 'normal' => {
  if (isOverdue(deadline)) return 'overdue';
  if (isApproaching(deadline)) return 'approaching';
  return 'normal';
};
