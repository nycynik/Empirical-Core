import React, {Component} from 'react'
import * as CLIntF from '../../../interfaces/ClassroomLessons';
import _ from 'lodash'
import MultipleTextEditor from '../../classroomLessons/shared/multipleTextEditor'
import StudentSingleAnswer from '../../classroomLessons/play/singleAnswer'

interface SingleAnswerProps {
  question: CLIntF.QuestionData,
  questionIndex: Number,
  updateQuestion: Function
}

class CustomizeSingleAnswer extends Component<SingleAnswerProps, any>{
  constructor(props){
    super(props);

    this.state = {
      question: props.question
    }

    this.handleTitleChange = this.handleTitleChange.bind(this)
    this.handlePromptChange = this.handlePromptChange.bind(this)
    this.handleInstructionsChange = this.handleInstructionsChange.bind(this)
    this.updateQuestion = this.updateQuestion.bind(this)
  }

  updateQuestion(newVals, questionIndex) {
    this.setState({question: newVals}, () => this.props.updateQuestion(newVals, questionIndex))
  }

  handleTitleChange(e) {
    const newVals = _.merge({}, this.state.question)
    _.set(newVals, 'teach.title', e.target.value)
    this.updateQuestion(newVals, this.props.questionIndex)
  }

  handlePromptChange(e) {
    const newVals = _.merge({}, this.state.question)
    _.set(newVals, 'play.prompt', e)
    this.updateQuestion(newVals, this.props.questionIndex)
  }

  handleInstructionsChange(e) {
    const newVals = _.merge({}, this.state.question)
    _.set(newVals, 'play.instructions', e.target.value)
    this.updateQuestion(newVals, this.props.questionIndex)
  }

  handleCuesChange(e) {
    const newVals = _.merge({}, this.state.question)
    const formattedCues = e.target.value.split(', ');
    _.set(newVals, 'play.cues', formattedCues)
    this.updateQuestion(newVals, this.props.questionIndex)
  }

  render() {
    return (
      <div className="slide">
        <div className="form">
          <div className="title-field field">
            <label>Title</label>
            <div className="control">
              <input value={this.state.question.teach.title} onChange={this.handleTitleChange} className="input" type="text" placeholder="Text input"/>
            </div>
          </div>
          <div className="prompt-field field">
            <label>Prompt</label>
            <div className="control">
              <MultipleTextEditor
                text={this.state.question.play.prompt}
                handleTextChange={(e) => this.handlePromptChange(e)}
              />
            </div>
          </div>
          <div className="instructions-field field">
            <label>Instructions <span className="optional">(Optional)</span></label>
            <div className="control">
              <input value={this.state.question.play.instructions} onChange={this.handleInstructionsChange} className="input" type="text" placeholder="Text input"/>
            </div>
          </div>
        </div>
        <div className="slide-preview-container">
          <p className="slide-title">{this.state.question.teach.title}</p>
          <div className="preview">
            <div className="scaler">
              <StudentSingleAnswer data={this.state.question} />
            </div>
          </div>
        </div>
      </div>
    )
  }

}

export default CustomizeSingleAnswer
