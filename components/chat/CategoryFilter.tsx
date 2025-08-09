import React from 'react'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Filter } from 'lucide-react'
import { groupCategories } from './constants'
import { filterGroupsByCategory } from './helpers'

interface CategoryFilterProps {
  selectedCategory: string
  onCategoryChange: (category: string) => void
  groups: any[]
}

export function CategoryFilter({ selectedCategory, onCategoryChange, groups }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <Button
        size="sm"
        variant={selectedCategory === 'all' ? 'default' : 'outline'}
        onClick={() => onCategoryChange('all')}
        className="rounded-xl"
      >
        <Filter className="w-4 h-4 mr-1" />
        Todos
      </Button>
      {groupCategories.map(category => {
        const categoryGroups = filterGroupsByCategory(groups, category.id)
        return (
          <Button
            key={category.id}
            size="sm"
            variant={selectedCategory === category.id ? 'default' : 'outline'}
            onClick={() => onCategoryChange(category.id)}
            className="rounded-xl"
          >
            <span className="mr-1">{category.icon}</span>
            {category.label.replace(/^.+ /, '')}
            {categoryGroups.length > 0 && (
              <Badge variant="secondary" className="ml-1 text-xs">
                {categoryGroups.length}
              </Badge>
            )}
          </Button>
        )
      })}
    </div>
  )
}