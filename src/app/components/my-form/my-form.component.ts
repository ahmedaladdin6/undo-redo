/**
 * MyFormComponent
 *
 * This component represents a form with multiple input fields that allows the user to input and edit data.
 * It provides Undo and Redo functionality to revert or reapply changes to the form.
 *
 * Features:
 * - Tracks changes in form inputs.
 * - Allows users to undo the last change or redo previously undone changes.
 * - Provides visual feedback for Undo/Redo button availability.
 */
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

export interface IFormData {
  firstName: string,
  lastName: string,
  email: string,
  comment: string,
  age: number,
  agree: boolean,
  gender: boolean,
  birthday: string,
  country: string
}
@Component({
  selector: 'app-my-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './my-form.component.html',
  styleUrls: ['./my-form.component.scss']
})
export class MyFormComponent implements OnInit {
/**
* Tracks the history of form states. Each entry in the array is a snapshot of the form values.
* @type {Array<IFormData>}
*/
  formStateHistory: IFormData[] = [];

/**
* Tracks the current position in the formStateHistory array.
* @type {number}
*/
  currentHistoryIndex = -1

/**
* Keeps count of Undo/Redo actions. add counter mean Undo actions, and negative counter mean Redo actions.
* @type {number}
*/
  undoRedoCounter = 0

/**
 * A flag that indicates whether the last action of  Redo that mean no data can redo it.
 * @type {boolean}
 */
  isLastRedoAction = false

/**
 * The reactive form group that contains the form controls and their values.
 * @type {FormGroup}
 */
  form: FormGroup = new FormGroup({})

/**
 * Angular lifecycle hook called when the component is initialized.
 * It initializes the form and subscribes to value changes to track the form state and record it to form history.
 */
  ngOnInit(): void {
    this.initializeForm()
    this.form.valueChanges.subscribe(() => this.onInputChange());
  }

/**
 * Initializes the reactive form with various controls (e.g., firstName, lastName, age, etc.).
 * This method sets up the initial form structure.
 */
  initializeForm() {
    this.form = new FormGroup({
      firstName: new FormControl(null),
      lastName: new FormControl(null),
      comment: new FormControl(null),
      age: new FormControl(0),
      agree: new FormControl(false),
      gender: new FormControl(false),
      birthday: new FormControl(''),
      country: new FormControl('')
    })
  }

/**
* Tracks form value changes and updates the history of form states.
* Adds the current state of the form to the formStateHistory array unless it is part of a Redo action.
*/
  onInputChange(): void {
    const currentState = this.form.getRawValue();
    if (this.undoRedoCounter <= 0) {
      this.formStateHistory.push(currentState)
      this.currentHistoryIndex++
    }
    //the second condition to be sure when the undoredoCounter be zero after last redo action pressed
    if (this.undoRedoCounter == 0 && this.isLastRedoAction == true) {
      this.isLastRedoAction = false;
      this.formStateHistory.pop()
      this.currentHistoryIndex--
    }
  }

  /**
* Undo functionality.
* Reverts the form to its previous state by incrementing the undoRedoCounter and
* applying the corresponding form state from the formStateHistory array.
*/
  undo() {
    this.undoRedoCounter++
    if (this.undoRedoCounter <= this.currentHistoryIndex)
      this.form.setValue(this.formStateHistory[this.currentHistoryIndex - this.undoRedoCounter])
    else
      this.initializeForm()
  }

/**
* Redo functionality.
* Reapplies the previously undone change by decrementing the undoRedoCounter and
* restoring the corresponding form state from the formStateHistory array.
*/
  redo() {
    this.undoRedoCounter--
    if (this.undoRedoCounter > 0)
      this.form.setValue(this.formStateHistory[(this.currentHistoryIndex - this.undoRedoCounter)])
    else {
      this.isLastRedoAction = true
      this.form.setValue(this.formStateHistory[(this.currentHistoryIndex)])
    }
  }

}

