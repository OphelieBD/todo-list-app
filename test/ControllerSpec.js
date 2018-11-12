/*global app, jasmine, describe, it, beforeEach, expect */

describe('controller', function () {
	'use strict';

	var subject, model, view;

	// Create a fake model (data used only for tests) 
	var setUpModel = function (todos) {
		model.read.and.callFake(function (query, callback) {
			callback = callback || query;
			callback(todos);
		});

		model.getCount.and.callFake(function (callback) {

			var todoCounts = {
				active: todos.filter(function (todo) {
					return !todo.completed;
				}).length,
				completed: todos.filter(function (todo) {
					return !!todo.completed;
				}).length,
				total: todos.length
			};

			callback(todoCounts);
		});

		model.remove.and.callFake(function (id, callback) {
			callback();
		});

		model.create.and.callFake(function (title, callback) {
			callback();
		});

		model.update.and.callFake(function (id, updateData, callback) {
			callback();
		});
	};

	var createViewStub = function () {
		var eventRegistry = {};
		return {
			render: jasmine.createSpy('render'),
			bind: function (event, handler) {
				eventRegistry[event] = handler;
			},
			trigger: function (event, parameter) {
				eventRegistry[event](parameter);
			}
		};
	};

	beforeEach(function () {
		model = jasmine.createSpyObj('model', ['read', 'getCount', 'remove', 'create', 'update']);
		view = createViewStub();
		subject = new app.Controller(model, view);
	});

	it('should show entries on start-up', function () {
		// TODO: write test
		///////////////////
		///////////////////
		// Creation of a 'todo' object
		var todo = {title: 'my todo'};
			
		// Creation of a fake model only used for this test
		setUpModel([todo]);

		// Initialisation of the vue with URL '' (=no road)
		subject.setView(''); 

		// expect = Jasmine'function which takes in parameter a function to test(here we test 'le rendu de la vue')
		// toHaveBeenCalledWith = Jasmine'function called 'spy' which knows what parameters were called with the function
		expect(view.render).toHaveBeenCalledWith('showEntries', [todo]);

		// --> If we call the view with url '' (=no road), we'll have the view with my object todo, called by our parameter 'showEntries'
	});

	describe('routing', function () {

		it('should show all entries without a route', function () {
			var todo = {title: 'my todo'};
			setUpModel([todo]);

			subject.setView('');

			expect(view.render).toHaveBeenCalledWith('showEntries', [todo]);
		});

		it('should show all entries without "all" route', function () {
			var todo = {title: 'my todo'};
			setUpModel([todo]);

			subject.setView('#/');

			expect(view.render).toHaveBeenCalledWith('showEntries', [todo]);
		});

		// It only shows tasks which are still not completed  
		it('should show active entries', function () {
			// TODO: write test
			///////////////////
			///////////////////

			// Creation of a 'todo' object
			var todo = {
					title: 'my todo',
					completed: false
			};

			// Creation of a fake model only used for this test
			setUpModel([todo]);

			// Initialisation of the vue with URL ('/active')
			subject.setView('#/active');

			// expect = Jasmine'function which takes in parameter a function to test(here we test 'le rendu de la vue')
			// toHaveBeenCalledWith = Jasmine'function called 'spy' which knows what parameters were called with the function
			expect(view.render).toHaveBeenCalledWith('showEntries', [todo]);
			expect(todo.completed).toEqual(false);

			// --> If we call the view with url '/active' (=with only not completed tasks), we'll have the view called by our parameter 'showEntries'
			// and it will also return my created todo
		});

		// It only shows tasks which are completed  
		it('should show completed entries', function () {
			// TODO: write test
			///////////////////
			///////////////////
			// Creation of a 'todo' object
			var todo = {
					title: 'my todo',
					completed: true
			};

			// Creation of a fake model only used for this test
			setUpModel([todo]);

			// Initialisation of the vue with URL ('/active')
			subject.setView('#/completed');

			// expect = Jasmine'function which takes in parameter a function to test(here we test 'le rendu de la vue')
			// toHaveBeenCalledWith = Jasmine'function called 'spy' which knows what parameters were called with the function
			expect(view.render).toHaveBeenCalledWith('showEntries', [todo]);
			expect(todo.completed).toEqual(true);

			// --> If we call the view with url '/completed' (=with only completed tasks), we'll have the view called by our parameter 'showEntries'
			// and it will also return my created todo
		});
	});

	it('should show the content block when todos exists', function () {
		setUpModel([{title: 'my todo', completed: true}]);

		subject.setView('');

		expect(view.render).toHaveBeenCalledWith('contentBlockVisibility', {
			visible: true
		});
	});

	it('should hide the content block when no todos exists', function () {
		setUpModel([]);

		subject.setView('');

		expect(view.render).toHaveBeenCalledWith('contentBlockVisibility', {
			visible: false
		});
	});

	it('should check the toggle all button, if all todos are completed', function () {
		setUpModel([{title: 'my todo', completed: true}]);

		subject.setView('');

		expect(view.render).toHaveBeenCalledWith('toggleAll', {
			checked: true
		});
	});

	it('should set the "clear completed" button', function () {
		var todo = {id: 42, title: 'my todo', completed: true};
		setUpModel([todo]);

		subject.setView('');

		expect(view.render).toHaveBeenCalledWith('clearCompletedButton', {
			completed: 1,
			visible: true
		});
	});

	// it displays all tasks, completed and active
	it('should highlight "All" filter by default', function () {
		// TODO: write test
		///////////////////
		///////////////////
		// Creation of a 'todo' object
		var todo = {
				id: 42, 
				title: 'my todo'
		};

		// Creation of a fake model only used for this test
		setUpModel([todo]);
		
		// Initialisation of the vue with URL ' ' (=all)
		subject.setView('');

		// expect = Jasmine'function which takes in parameter a function to test(here we test 'le rendu de la vue')
		// toHaveBeenCalledWith = Jasmine'function called 'spy' which knows what parameters were called with the function
		expect(view.render).toHaveBeenCalledWith('setFilter', '');

		// --> If we call the view with url '/ ' (=all), we'll have the view called by our parameter 'setFilter'
		// and it will also return my created todo with all tasks
	});

	// it displays only not completed tasks when switching to active view
	it('should highlight "Active" filter when switching to active view', function () {
		// TODO: write test
		///////////////////
		///////////////////
		// Creation of a 'todo' object
		var todo = {
				id: 42, 
				title: 'my todo', 
				completed: false
		};

		// Creation of a fake model only used for this test
		setUpModel([todo]);

		// Initialisation of the vue with URL '/active ' (=tasks which are still not completed)
		subject.setView('#/active');

		// expect = Jasmine'function which takes in parameter a function to test(here we test 'le rendu de la vue')
		// toHaveBeenCalledWith = Jasmine'function called 'spy' which knows what parameters were called with the function
		expect(view.render).toHaveBeenCalledWith('setFilter', 'active');

		// --> If we call the view with url '/active ' (=not completed tasks), we'll have the view called by our parameter 'setFilter'
		// and it will also return my created todo with only the not completed tasks
	});

	// Toggle = switch
	describe('toggle all', function () {
		it('should toggle all todos to completed', function () {
			// TODO: write test
			///////////////////
			///////////////////
			// Creation of a 'todo' object
			var todo = {
					id: 3, 
					title: 'my todo', 
					completed: false
			};
		
			// Creation of a fake model only used for this test
 			setUpModel([todo]);

			// Initialisation of the vue with URL ' ' (=without a road)
 			subject.setView('');
 
 			// We trigger (=déclencher) the function 'toggle all' with in params the attribute completed
 			view.trigger('toggleAll', {completed: true});

 			// expect = Jasmine'function which takes in parameter a function to test(here we test 'la mise à jour du model')
			// toHaveBeenCalledWith = Jasmine'function called 'spy' which knows what parameters were called with the function
 			expect(model.update).toHaveBeenCalledWith(3, {completed: true}, jasmine.any(Function)); // Params: id, data, callback

			// --> If we trigger the function 'toggle all', all the objects will be completed
		});

		it('should update the view', function () {
			// TODO: write test
			///////////////////
			///////////////////
			// Creation of a 'todo' object
			var todo = {
					id: 3, 
					title: 'my todo', 
					completed: true
			};
			
			// Creation of a fake model only used for this test
 			setUpModel([todo]);

			// Initialisation of the vue with URL ' ' (=without a road)
			subject.setView('');

 			// We trigger (=déclencher) the function 'toggle all' with the params completed attribute
			view.trigger('toggleAll',  {completed: true});

 			// expect = Jasmine'function which takes in parameter a function to test(here we test 'le rendu de la view')
			// toHaveBeenCalledWith = Jasmine'function called 'spy' which knows what parameters were called with the function
 			expect(view.render).toHaveBeenCalledWith('elementComplete', {id: 3, completed: true}); // Params: id and completed attributes

 			// --> If we trigger the function 'toggle all', the view will return a page where all tasks will be completed
		});
	});

	describe('new todo', function () {
		it('should add a new todo to the model', function () {
			// TODO: write test
			///////////////////
			///////////////////
			// Creation of a 'todo' object
			setUpModel([]);
			
			// Creation of a fake model only used for this test
			subject.setView('');
			
 			// We trigger (=déclencher) the function 'newTodo' with the params 'a new task to do' in title
 			view.trigger('newTodo', 'a new task to do');

 			// expect = Jasmine'function which takes in parameter a function to test(here we test 'la création du model')
			// toHaveBeenCalledWith = Jasmine'function called 'spy' which knows what parameters were called with the function
 			expect(model.create).toHaveBeenCalledWith('a new task to do', jasmine.any(Function));

 			// --> If we trigger the function 'newTodo', we'll have a new item (called 'a new task to do' in this case)
		});

		it('should add a new todo to the view', function () {
			setUpModel([]);

			subject.setView('');

			view.render.calls.reset();
			model.read.calls.reset();
			model.read.and.callFake(function (callback) {
				callback([{
					title: 'a new todo',
					completed: false
				}]);
			});

			view.trigger('newTodo', 'a new todo');

			expect(model.read).toHaveBeenCalled();

			expect(view.render).toHaveBeenCalledWith('showEntries', [{
				title: 'a new todo',
				completed: false
			}]);
		});

		it('should clear the input field when a new todo is added', function () {
			setUpModel([]);

			subject.setView('');

			view.trigger('newTodo', 'a new todo');

			expect(view.render).toHaveBeenCalledWith('clearNewTodo');
		});
	});

	describe('element removal', function () {
		it('should remove an entry from the model', function () {
			// TODO: write test
			///////////////////
			///////////////////
			// Creation of a 'todo' object
			var todo = {
					id: 42, 
					title: 'my todo'
			};
 			
			// Creation of a 'todo' object
 			setUpModel([todo]);

			// Creation of a fake model only used for this test
 			subject.setView('');
			
 			// We trigger (=déclencher) the function 'itemRemove' with the params attribute ID
 			view.trigger('itemRemove', {id: 42});
 			
 			// expect = Jasmine'function which takes in parameter a function to test (here we test 'l'annulation d'un item dans le model')
			// toHaveBeenCalledWith = Jasmine'function called 'spy' which knows what parameters were called with the function
 			expect(model.remove).toHaveBeenCalledWith(42,  jasmine.any(Function));

 			// --> If we trigger the function 'itemRemove' for the item 42, it will process to its removal 
		});

		it('should remove an entry from the view', function () {
			var todo = {id: 42, title: 'my todo', completed: true};
			setUpModel([todo]);

			subject.setView('');
			view.trigger('itemRemove', {id: 42});

			expect(view.render).toHaveBeenCalledWith('removeItem', 42);
		});

		it('should update the element count', function () {
			var todo = {id: 42, title: 'my todo', completed: true};
			setUpModel([todo]);

			subject.setView('');
			view.trigger('itemRemove', {id: 42});

			expect(view.render).toHaveBeenCalledWith('updateElementCount', 0);
		});
	});

	describe('remove completed', function () {
		it('should remove a completed entry from the model', function () {
			var todo = {id: 42, title: 'my todo', completed: true};
			setUpModel([todo]);

			subject.setView('');
			view.trigger('removeCompleted');

			expect(model.read).toHaveBeenCalledWith({completed: true}, jasmine.any(Function));
			expect(model.remove).toHaveBeenCalledWith(42, jasmine.any(Function));
		});

		it('should remove a completed entry from the view', function () {
			var todo = {id: 42, title: 'my todo', completed: true};
			setUpModel([todo]);

			subject.setView('');
			view.trigger('removeCompleted');

			expect(view.render).toHaveBeenCalledWith('removeItem', 42);
		});
	});

	describe('element complete toggle', function () {
		it('should update the model', function () {
			var todo = {id: 21, title: 'my todo', completed: false};
			setUpModel([todo]);
			subject.setView('');

			view.trigger('itemToggle', {id: 21, completed: true});

			expect(model.update).toHaveBeenCalledWith(21, {completed: true}, jasmine.any(Function));
		});

		it('should update the view', function () {
			var todo = {id: 42, title: 'my todo', completed: true};
			setUpModel([todo]);
			subject.setView('');

			view.trigger('itemToggle', {id: 42, completed: false});

			expect(view.render).toHaveBeenCalledWith('elementComplete', {id: 42, completed: false});
		});
	});

	describe('edit item', function () {
		it('should switch to edit mode', function () {
			var todo = {id: 21, title: 'my todo', completed: false};
			setUpModel([todo]);

			subject.setView('');

			view.trigger('itemEdit', {id: 21});

			expect(view.render).toHaveBeenCalledWith('editItem', {id: 21, title: 'my todo'});
		});

		it('should leave edit mode on done', function () {
			var todo = {id: 21, title: 'my todo', completed: false};
			setUpModel([todo]);

			subject.setView('');

			view.trigger('itemEditDone', {id: 21, title: 'new title'});

			expect(view.render).toHaveBeenCalledWith('editItemDone', {id: 21, title: 'new title'});
		});

		it('should persist the changes on done', function () {
			var todo = {id: 21, title: 'my todo', completed: false};
			setUpModel([todo]);

			subject.setView('');

			view.trigger('itemEditDone', {id: 21, title: 'new title'});

			expect(model.update).toHaveBeenCalledWith(21, {title: 'new title'}, jasmine.any(Function));
		});

		it('should remove the element from the model when persisting an empty title', function () {
			var todo = {id: 21, title: 'my todo', completed: false};
			setUpModel([todo]);

			subject.setView('');

			view.trigger('itemEditDone', {id: 21, title: ''});

			expect(model.remove).toHaveBeenCalledWith(21, jasmine.any(Function));
		});

		it('should remove the element from the view when persisting an empty title', function () {
			var todo = {id: 21, title: 'my todo', completed: false};
			setUpModel([todo]);

			subject.setView('');

			view.trigger('itemEditDone', {id: 21, title: ''});

			expect(view.render).toHaveBeenCalledWith('removeItem', 21);
		});

		it('should leave edit mode on cancel', function () {
			var todo = {id: 21, title: 'my todo', completed: false};
			setUpModel([todo]);

			subject.setView('');

			view.trigger('itemEditCancel', {id: 21});

			expect(view.render).toHaveBeenCalledWith('editItemDone', {id: 21, title: 'my todo'});
		});

		it('should not persist the changes on cancel', function () {
			var todo = {id: 21, title: 'my todo', completed: false};
			setUpModel([todo]);

			subject.setView('');

			view.trigger('itemEditCancel', {id: 21});

			expect(model.update).not.toHaveBeenCalled();
		});
	});
});
