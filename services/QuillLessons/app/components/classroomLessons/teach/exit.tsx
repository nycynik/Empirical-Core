import * as React from 'react';
import FlaggedStudents from './flaggedStudents'
import AssignmentOptions from './assignmentOptions'
import AssignButton from './assignButton'
import AssignedSection from './assignedSection'
import ScriptComponent from '../shared/scriptComponent'
import { getParameterByName } from '../../../libs/getParameterByName';

class ExitSlide extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.goToReports = this.goToReports.bind(this)
  }

  goToReports() {
    const caId: string|null = getParameterByName('classroom_activity_id');
    window.location.href = `${process.env.EMPIRICAL_BASE_URL}/teachers/progress_reports/report_from_classroom_activity/${caId}`
  }

  renderAssignmentOptionsAndButton() {
    const {followUpActivityName, students} = this.props
    if (this.props.completed) {
      return <div className='assign-button-container'>
      <button onClick={this.goToReports}>Exit Lesson | View Report</button>
      </div>
    } else {
      if (followUpActivityName && students && Object.keys(students).length > 0) {
        return <div>
        <AssignmentOptions
        numberOfStudents={students ? Object.keys(students).length : 0}
        updateSelectedOptionKey={this.props.updateSelectedOptionKey}
        selectedOptionKey={this.props.selectedOptionKey}
        followUpActivityName={followUpActivityName}
        />
        <AssignButton selectedOptionKey={this.props.selectedOptionKey}
        assignAction={this.props.finishLesson}
        />
        </div>
      } else if (!followUpActivityName && !this.props.data.preview) {
        return <div className='assign-button-container'>
        <button onClick={this.props.finishLesson}>Mark Lesson As Complete</button>
        </div>
      }
    }
  }

  renderFlaggedStudents() {
    const {flaggedStudents, students} = this.props
    if (students && Object.keys(students).length > 0)
    return  <FlaggedStudents
              flaggedStudents={flaggedStudents}
              students={students}
              toggleStudentFlag={this.props.toggleStudentFlag}
            />
  }

  renderAssignedSection() {
    if (this.props.completed && this.props.followUpActivityName) {
      return <AssignedSection selectedOptionKey={this.props.selectedOptionKey} />
    }
  }

  render() {
    return (
      <div className='teacher-exit'>
        <div className="header">
          <h1>
            <span>Slide {this.props.data.current_slide}:</span> {this.props.editionData.questions[this.props.data.current_slide].data.teach.title}
          </h1>
        </div>
        <ScriptComponent
          script={this.props.script}
          onlyShowHeaders={this.props.onlyShowHeaders}
          updateToggledHeaderCount={this.props.updateToggledHeaderCount}
        />
        {this.renderFlaggedStudents()}
        {this.renderAssignedSection()}
        {this.renderAssignmentOptionsAndButton()}
      </div>
    );
  }

}

export default ExitSlide;
