import {Page, expect, Locator} from "@playwright/test";

export class DemoPage {
    public url = 'https://demo.playwright.dev/todomvc';
    readonly page: Page;
    readonly newTodo: Locator;
    readonly todoItems: Locator;
    readonly todoTitles: Locator;
    readonly todoCount: Locator;
    readonly toggleAll: Locator;
    readonly clearCompletedButton: Locator;
    readonly activeLink: Locator;
    readonly allLink: Locator;
    readonly completedLink: Locator;

    constructor(page: Page) {
        this.page = page;
        this.newTodo = page.getByPlaceholder('What needs to be done?');
        this.todoItems = page.getByTestId('todo-item');
        this.todoTitles = page.getByTestId('todo-title');
        this.todoCount = page.getByTestId('todo-count');
        this.toggleAll = this.page.getByLabel('Mark all as complete');
        this.clearCompletedButton = this.page.getByRole('button', { name: 'Clear completed' });
        this.activeLink = page.getByRole('link', { name: 'Active' });
        this.allLink = page.getByRole('link', { name: 'All' })
        this.completedLink = page.getByRole('link', { name: 'Completed' })
    }

    async goto() {
        await this.page.goto(this.url);
    }

    async reload() {
        await this.page.reload();
    }

    async goBack() {
        await this.page.goBack();
    }

    async createTodo(title: string) {
        await this.newTodo.fill(title);
        await this.newTodo.press('Enter');
    }

    async createTodos(titles: readonly string[]) {
        for (const title of titles) {
            await this.createTodo(title);
        }
    }

    async expectTodoTitles(titles: readonly string[]) {
        await expect(this.todoTitles).toHaveText(titles);
    }

    async expectInputIsEmpty() {
        await expect(this.newTodo).toBeEmpty();
    }

    async expectTodoCountIsVisible() {
        await expect(this.todoCount).toBeVisible();
    }

    async expectTodoCountTextToBe(text: string) {
        await expect(this.todoCount).toHaveText(text);
    }

    async expectTodoCountTextToContain(text: string) {
        await expect(this.todoCount).toContainText(text);
    }

    async expectToDoCountTextToMatch(pattern: RegExp) {
        await expect(this.todoCount).toHaveText(pattern);
    }

    async markAllTodosCompleted() {
        await this.toggleAll.check();
    }

    async markAllTodosNotCompleted() {
        await this.toggleAll.uncheck();
    }

    async expectAllTodosCompleted(count: number) {
        const classes = Array(count).fill('completed');
        await expect(this.todoItems).toHaveClass(classes);
    }

    async expectAllTodosNotCompleted(count: number) {
        const classes = Array(count).fill('');
        await expect(this.todoItems).toHaveClass(classes);
    }

    async checkTodoAt(index: number) {
        await this.todoItems.nth(index).getByRole('checkbox').check();
    }

    async uncheckTodoAt(index: number) {
        await this.todoItems.nth(index).getByRole('checkbox').uncheck();
    }

    async expectToggleAllChecked() {
        await expect(this.toggleAll).toBeChecked();
    }

    async expectToggleAllUnchecked() {
        await expect(this.toggleAll).not.toBeChecked();
    }

    async expectTodoCompleted(index: number) {
        await expect(this.todoItems.nth(index)).toHaveClass('completed');
    }

    async expectTodoNotCompleted(index: number) {
        await expect(this.todoItems.nth(index)).not.toHaveClass('completed');
    }

    async editTodoAt(index: number, newText: string) {
        const item = this.todoItems.nth(index);
        await item.dblclick();

        const editInput = item.getByRole('textbox', { name: 'Edit' });
        await editInput.fill(newText);
        await editInput.press('Enter');
    }

    async getTodoItemAt(index: number) {
        return this.todoItems.nth(index);
    }

    async expectClearCompletedButtonIsVisible() {
        await expect(this.clearCompletedButton).toBeVisible();
    }

    async expectClearCompletedButtonIsHidden() {
        await expect(this.clearCompletedButton).toBeHidden();
    }

    async clickClearCompletedButton() {
        await this.clearCompletedButton.click();
    }

    async expectTodoItemsCount(count: number) {
        await expect(this.todoItems).toHaveCount(count);
    }

    async expectTodoItemChecked(index: number) {
        await expect(this.todoItems.nth(index)).toBeChecked();
    }

    async clickActiveLink() {
        await this.activeLink.click();
    }

    async clickAllLink() {
        await this.allLink.click();
    }

    async clickCompletedLink() {
        await this.completedLink.click();
    }

    async checkNumberOfTodosInLocalStorage(count: number) {
        await this.page.waitForFunction(e => {
            return JSON.parse(localStorage['react-todos']).length === e;
        }, count);
    }

    async checkNumberOfCompletedTodosInLocalStorage(count: number) {
        await this.page.waitForFunction(e => {
            return JSON.parse(localStorage['react-todos']).filter((todo: any) => todo.completed).length === e;
        }, count);
    }

    async checkTodosInLocalStorage(title: string) {
        await this.page.waitForFunction(t => {
            return JSON.parse(localStorage['react-todos']).map((todo: any) => todo.title).includes(t);
        }, title);
    }
}