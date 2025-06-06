import { test, expect } from '@playwright/test';
import { DemoPage } from "../pages/demo-todo-app.page";

test.beforeEach(async ({ page }) => {
  const demoPage = new DemoPage(page);
  await demoPage.goto();
});

const TODO_ITEMS = [
  'buy some cheese',
  'feed the cat',
  'book a doctors appointment'
] as const;

test.describe('New Todo', () => {
  test('should allow me to add todo items', async ({ page }) => {
    const demoPage = new DemoPage(page);

    // Create 1st todo.
    await demoPage.createTodo(TODO_ITEMS[0]);

    // Make sure the list only has one todo item.
    await demoPage.expectTodoTitles([
        TODO_ITEMS[0]
    ]);

    // Create 2nd todo.
    await demoPage.createTodo(TODO_ITEMS[1]);

    // Make sure the list now has two todo items.
    await demoPage.expectTodoTitles([
        TODO_ITEMS[0],
        TODO_ITEMS[1]
    ]);

    await demoPage.checkNumberOfTodosInLocalStorage(2);
  });

  test('should clear text input field when an item is added', async ({ page }) => {
    const demoPage = new DemoPage(page);

    // Create one todo item.
    await demoPage.createTodo(TODO_ITEMS[0]);

    // Check that input is empty.
    await demoPage.expectInputIsEmpty();
    await demoPage.checkNumberOfTodosInLocalStorage(1);
  });

  test('should append new items to the bottom of the list', async ({ page }) => {
    const demoPage = new DemoPage(page);
    // Create 3 items.
    await demoPage.createTodos(TODO_ITEMS);
  
    // Check test using different methods.
    await demoPage.expectTodoCountIsVisible();
    await demoPage.expectTodoCountTextToBe('3 items left');
    await demoPage.expectTodoCountTextToContain('3');
    await demoPage.expectToDoCountTextToMatch(/3/);

    // Check all items in one call.
    await demoPage.expectTodoTitles(TODO_ITEMS);
    await demoPage.checkNumberOfTodosInLocalStorage(3);
  });
});

test.describe('Mark all as completed', () => {
  test.beforeEach(async ({ page }) => {
    const demoPage = new DemoPage(page);
    await demoPage.createTodos(TODO_ITEMS);
    await demoPage.checkNumberOfTodosInLocalStorage(3);
  });

  test.afterEach(async ({ page }) => {
    const demoPage = new DemoPage(page);
    await demoPage.checkNumberOfTodosInLocalStorage(3);
  });

  test('should allow me to mark all items as completed', async ({ page }) => {
    const demoPage = new DemoPage(page);

    // Complete all todos.
    await demoPage.markAllTodosCompleted();

    // Ensure all todos have 'completed' class.
    await demoPage.expectAllTodosCompleted(3);
    await demoPage.checkNumberOfCompletedTodosInLocalStorage(3);
  });

  test('should allow me to clear the complete state of all items', async ({ page }) => {
    const demoPage = new DemoPage(page);

    // Check and then immediately uncheck.
    await demoPage.markAllTodosCompleted();
    await demoPage.markAllTodosNotCompleted();

    // Should be no completed classes.
    await demoPage.expectAllTodosNotCompleted(3);
  });

  test('complete all checkbox should update state when items are completed / cleared', async ({ page }) => {
    const demoPage = new DemoPage(page);
    await demoPage.markAllTodosCompleted();
    await demoPage.expectAllTodosCompleted(3);
    await demoPage.checkNumberOfCompletedTodosInLocalStorage(3);

    // Uncheck first todo.
    await demoPage.uncheckTodoAt(0);

    // Reuse toggleAll locator and make sure its not checked.
    await demoPage.expectToggleAllUnchecked();

    await demoPage.checkTodoAt(0);
    await demoPage.checkNumberOfCompletedTodosInLocalStorage(3);

    // Assert the toggle all is checked again.
    await demoPage.expectToggleAllChecked();
  });
});

test.describe('Item', () => {

  test('should allow me to mark items as complete', async ({ page }) => {
    const demoPage = new DemoPage(page);

    // Create two items.
    await demoPage.createTodos(TODO_ITEMS.slice(0, 2));

    // Check first item.
    await demoPage.checkTodoAt(0);
    await demoPage.expectTodoCompleted(0);

    // Check second item.
    await demoPage.expectTodoNotCompleted(1);
    await demoPage.checkTodoAt(1);

    // Assert completed class.
    await demoPage.expectTodoCompleted(0);
    await demoPage.expectTodoCompleted(1);
  });

  test('should allow me to un-mark items as complete', async ({ page }) => {
    const demoPage = new DemoPage(page);

    // Create two items.
    await demoPage.createTodos(TODO_ITEMS.slice(0, 2));

    await demoPage.checkTodoAt(0);
    await demoPage.expectTodoCompleted(0);
    await demoPage.expectTodoNotCompleted(1);
    await demoPage.checkNumberOfCompletedTodosInLocalStorage(1);

    await demoPage.uncheckTodoAt(0);
    await demoPage.expectTodoNotCompleted(0);
    await demoPage.expectTodoNotCompleted(1);
    await demoPage.checkNumberOfCompletedTodosInLocalStorage(0);
  });

  test('should allow me to edit an item', async ({ page }) => {
    const demoPage = new DemoPage(page);

    await demoPage.createTodos(TODO_ITEMS);

    await demoPage.editTodoAt(1, 'buy some sausages');

    // Explicitly assert the new text value.
    await demoPage.expectTodoTitles([
      TODO_ITEMS[0],
      'buy some sausages',
      TODO_ITEMS[2]
    ]);
    await demoPage.checkTodosInLocalStorage('buy some sausages');
  });
});

test.describe('Editing', () => {
  test.beforeEach(async ({ page }) => {
    const demoPage = new DemoPage(page);
    await demoPage.createTodos(TODO_ITEMS);
    await demoPage.checkNumberOfTodosInLocalStorage(3);
  });

  test('should hide other controls when editing', async ({ page }) => {
    const demoPage = new DemoPage(page);

    const secondItem = await demoPage.getTodoItemAt(1);
    await secondItem.dblclick();
    await expect(secondItem.getByRole('checkbox')).not.toBeVisible();
    await expect(secondItem.locator('label', {
      hasText: TODO_ITEMS[1],
    })).not.toBeVisible();
    await demoPage.checkNumberOfCompletedTodosInLocalStorage(3);
  });

  test('should save edits on blur', async ({ page }) => {
    const demoPage = new DemoPage(page);

    const secondItem = await demoPage.getTodoItemAt(1);
    await secondItem.dblclick();
    await secondItem.getByRole('textbox', { name: 'Edit' }).fill('buy some sausages');
    await secondItem.getByRole('textbox', { name: 'Edit' }).dispatchEvent('blur');

    await demoPage.expectTodoTitles([
      TODO_ITEMS[0],
      'buy some sausages',
      TODO_ITEMS[2]
    ]);
    await demoPage.checkTodosInLocalStorage('buy some sausages');
  });

  test('should trim entered text', async ({ page }) => {
    const demoPage = new DemoPage(page);

    await demoPage.editTodoAt(1, '    buy some sausages    ');

    await demoPage.expectTodoTitles([
      TODO_ITEMS[0],
      'buy some sausages',
      TODO_ITEMS[2]
    ]);
    await demoPage.checkTodosInLocalStorage('buy some sausages');
  });

  test('should remove the item if an empty text string was entered', async ({ page }) => {
    const demoPage = new DemoPage(page);

    await demoPage.editTodoAt(1, '');

    await demoPage.expectTodoTitles([
      TODO_ITEMS[0],
      TODO_ITEMS[2]
    ]);
  });

  test('should cancel edits on escape', async ({ page }) => {
    const demoPage = new DemoPage(page);

    const secondItem = await demoPage.getTodoItemAt(1);
    await secondItem.dblclick();
    await secondItem.getByRole('textbox', { name: 'Edit' }).fill('buy some sausages');
    await secondItem.getByRole('textbox', { name: 'Edit' }).press('Escape');
    await demoPage.expectTodoTitles(TODO_ITEMS);
  });
});

test.describe('Counter', () => {
  test('should display the current number of todo items', async ({ page }) => {
    const demoPage = new DemoPage(page);

    await demoPage.createTodo(TODO_ITEMS[0]);
    await demoPage.expectTodoCountTextToContain('1');

    await demoPage.createTodo(TODO_ITEMS[1]);
    await demoPage.expectTodoCountTextToContain('2');

    await demoPage.checkNumberOfTodosInLocalStorage(2);
  });
});

test.describe('Clear completed button', () => {
  test.beforeEach(async ({ page }) => {
    const demoPage = new DemoPage(page);
    await demoPage.createTodos(TODO_ITEMS);
  });

  test('should display the correct text', async ({ page }) => {
    const demoPage = new DemoPage(page);
    await demoPage.checkTodoAt(0);

    await demoPage.expectClearCompletedButtonIsVisible();
  });

  test('should remove completed items when clicked', async ({ page }) => {
    const demoPage = new DemoPage(page);

    await demoPage.checkTodoAt(1);
    await demoPage.clickClearCompletedButton();
    await demoPage.expectTodoItemsCount(2);
    await demoPage.expectTodoTitles([TODO_ITEMS[0], TODO_ITEMS[2]]);
  });

  test('should be hidden when there are no items that are completed', async ({ page }) => {
    const demoPage = new DemoPage(page);

    await demoPage.checkTodoAt(0);
    await demoPage.clickClearCompletedButton();
    await demoPage.expectClearCompletedButtonIsHidden();
  });
});

test.describe('Persistence', () => {
  test('should persist its data', async ({ page }) => {
    const demoPage = new DemoPage(page);

    await demoPage.createTodos(TODO_ITEMS.slice(0, 2));

    await demoPage.checkTodoAt(0);
    await demoPage.expectTodoTitles([TODO_ITEMS[0], TODO_ITEMS[1]]);
    await demoPage.expectTodoItemChecked(0);
    await expect(demoPage.todoItems).toHaveClass(['completed', '']);

    // Ensure there is 1 completed item.
    await demoPage.checkNumberOfCompletedTodosInLocalStorage(1);

    // Now reload.
    await demoPage.reload();
    await demoPage.expectTodoTitles([TODO_ITEMS[0], TODO_ITEMS[1]]);
    await demoPage.expectTodoItemChecked(0);
    await expect(demoPage.todoItems).toHaveClass(['completed', '']);
  });
});

test.describe('Routing', () => {
  test.beforeEach(async ({ page }) => {
    const demoPage = new DemoPage(page);
    await demoPage.createTodos(TODO_ITEMS);
    // make sure the app had a chance to save updated todos in storage
    // before navigating to a new view, otherwise the items can get lost :(
    // in some frameworks like Durandal
    await demoPage.checkTodosInLocalStorage(TODO_ITEMS[0]);
  });

  test('should allow me to display active items', async ({ page }) => {
    const demoPage = new DemoPage(page);

    await demoPage.checkTodoAt(1);

    await demoPage.checkNumberOfCompletedTodosInLocalStorage(1);

    await demoPage.clickActiveLink();
    await demoPage.expectTodoItemsCount(2);
    await demoPage.expectTodoTitles([TODO_ITEMS[0], TODO_ITEMS[2]]);
  });

  test('should respect the back button', async ({ page }) => {
    const demoPage = new DemoPage(page);

    await demoPage.checkTodoAt(1);

    await demoPage.checkNumberOfCompletedTodosInLocalStorage(1);

    await test.step('Showing all items', async () => {
      await demoPage.clickAllLink();
      await demoPage.expectTodoItemsCount(3);
    });

    await test.step('Showing active items', async () => {
      await demoPage.clickAllLink();
    });

    await test.step('Showing completed items', async () => {
      await demoPage.clickCompletedLink();
    });

    await demoPage.expectTodoItemsCount(1);
    await demoPage.goBack();
    await demoPage.expectTodoItemsCount(2);
    await demoPage.goBack();
    await demoPage.expectTodoItemsCount(3);
  });

  test('should allow me to display completed items', async ({ page }) => {
    const demoPage = new DemoPage(page);

    await demoPage.checkTodoAt(1);
    await demoPage.checkNumberOfCompletedTodosInLocalStorage(1);
    await demoPage.clickCompletedLink();
    await demoPage.expectTodoItemsCount(1);
  });

  test('should allow me to display all items', async ({ page }) => {
    const demoPage = new DemoPage(page);

    await demoPage.checkTodoAt(1);
    await demoPage.checkNumberOfCompletedTodosInLocalStorage(1);
    await demoPage.clickActiveLink();
    await demoPage.clickCompletedLink();
    await demoPage.clickAllLink();
    await demoPage.expectTodoItemsCount(3);
  });

  test('should highlight the currently applied filter', async ({ page }) => {
    const demoPage = new DemoPage(page);

    await expect(demoPage.allLink).toHaveClass('selected')

    await demoPage.clickActiveLink();
    await expect(demoPage.activeLink).toHaveClass('selected');

    await demoPage.clickCompletedLink();
    await expect(demoPage.completedLink).toHaveClass('selected');
  });
});

/*async function createDefaultTodos(page: Page) {
  // create a new todo locator
  const newTodo = page.getByPlaceholder('What needs to be done?');

  for (const item of TODO_ITEMS) {
    await newTodo.fill(item);
    await newTodo.press('Enter');
  }
}*/

/*async function checkNumberOfTodosInLocalStorage(page: Page, expected: number) {
  return await page.waitForFunction(e => {
    return JSON.parse(localStorage['react-todos']).length === e;
  }, expected);
}*/

/*async function checkNumberOfCompletedTodosInLocalStorage(page: Page, expected: number) {
  return await page.waitForFunction(e => {
    return JSON.parse(localStorage['react-todos']).filter((todo: any) => todo.completed).length === e;
  }, expected);
}*/

/*async function checkTodosInLocalStorage(page: Page, title: string) {
  return await page.waitForFunction(t => {
    return JSON.parse(localStorage['react-todos']).map((todo: any) => todo.title).includes(t);
  }, title);
}*/
