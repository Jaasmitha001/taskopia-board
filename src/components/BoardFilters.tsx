
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FilterOptions, Priority, Status } from '@/types/kanban';
import { users } from '@/data/mockData';
import { RefreshCw, Search, SlidersHorizontal, X } from 'lucide-react';
import { useState } from 'react';

interface BoardFiltersProps {
  filters: FilterOptions;
  onFilterChange: (filters: Partial<FilterOptions>) => void;
  onClearFilters: () => void;
}

export function BoardFilters({ filters, onFilterChange, onClearFilters }: BoardFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const hasActiveFilters = 
    filters.search !== '' || 
    filters.priority !== 'All' || 
    filters.assignee !== 'All' || 
    filters.status !== 'All';

  return (
    <div className="bg-card rounded-lg shadow-sm border p-4 mb-6">
      <div className="flex flex-col gap-4">
        <div className="flex gap-2 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search tasks..."
              value={filters.search}
              onChange={(e) => onFilterChange({ search: e.target.value })}
              className="pl-9"
            />
            {filters.search && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-9 w-9"
                onClick={() => onFilterChange({ search: '' })}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
            className={isExpanded ? 'bg-primary/10' : ''}
          >
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
          {hasActiveFilters && (
            <Button 
              variant="outline" 
              size="icon" 
              onClick={onClearFilters}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        {isExpanded && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col space-y-1.5">
              <label className="text-sm font-medium">Priority</label>
              <Select 
                value={filters.priority} 
                onValueChange={(value) => onFilterChange({ priority: value as Priority | 'All' })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All priorities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="All">All priorities</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col space-y-1.5">
              <label className="text-sm font-medium">Status</label>
              <Select 
                value={filters.status} 
                onValueChange={(value) => onFilterChange({ status: value as Status | 'All' })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="All">All statuses</SelectItem>
                    <SelectItem value="To Do">To Do</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Review">Review</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col space-y-1.5">
              <label className="text-sm font-medium">Assignee</label>
              <Select 
                value={filters.assignee} 
                onValueChange={(value) => onFilterChange({ assignee: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All team members" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="All">All team members</SelectItem>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
