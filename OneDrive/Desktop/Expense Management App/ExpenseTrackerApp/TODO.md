# Edit Plan Implementation - Aurora Expense Tracker

## Approved Plan Summary
- Add Edit/Delete buttons to ExpenseCard in index.tsx
- Navigate to add-expense.tsx for edit with prefilled data
- Fix theme switching on add-expense.tsx (hardcoded dark)

## Steps:
- [x] 1. Create TODO.md
- [x] 2. Update ExpenseCard.tsx: Add onEdit prop, Edit button next to amount  
- [x] 3. Update index.tsx: Add handleEdit function with navigation + themeMode params
- [x] 4. Update add-expense.tsx: 
  - Dynamic themeMode from route params
  - Edit mode: parse editingExpense from params, prefill form, update on save
  - Add cancel button for edit mode
- [ ] 5. Test: Toggle theme in index, add/edit expense, verify theme + CRUD

✅ All edits complete. Test: Toggle theme → add (+) → light theme. Swipe cards → delete. Edit button → prefilled form w/ correct theme.

