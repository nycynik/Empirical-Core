require 'rails_helper'

describe 'ScorebookQuery' do

  let!(:teacher) { create(:teacher_with_a_couple_classrooms_with_one_student_each) }
  let!(:classroom) { teacher.classrooms_i_teach.first }
  let!(:classroom1) { teacher.classrooms_i_teach.second }
  let!(:student) { classroom.students.first }
  let!(:student1) { classroom1.students.first }

  let!(:teacher1) {create(:teacher) }

  let!(:section) {create(:section)}
  let!(:topic_category) {create(:topic_category)}
  let!(:topic) {create(:topic, topic_category: topic_category, section: section)}
  let!(:activity_classification) {create :activity_classification}

  let!(:activity1) {create(:activity, topic: topic, classification: activity_classification)}
  let!(:activity2) {create(:activity, topic: topic, classification: activity_classification)}

  let!(:unit) {create(:unit)}

  let!(:classroom_activity1) {create(:classroom_activity, activity: activity1, classroom: classroom, unit: unit, assigned_student_ids: [student.id]  )}
  let!(:classroom_activity2) {create(:classroom_activity, activity: activity2, classroom: classroom, unit: unit, assigned_student_ids: [student.id] )}

  let!(:activity_session1) {create(:activity_session,  completed_at: Time.now, percentage: 1.0, user: student, classroom_activity: classroom_activity1, activity: activity1, is_final_score: true)}
  let!(:activity_session2) {create(:activity_session,  completed_at: Time.now, percentage: 0.2, user: student, classroom_activity: classroom_activity2, activity: activity2, is_final_score: false)}



  it 'returns a completed activity that is a final scores' do
    results = Scorebook::Query.run(classroom.id)
    expect(results.map{|res| res["id"]}).to include(activity_session2.id.to_s)
  end

  describe 'support date constraints' do
    it 'returns activities completed between the specified dates' do
      begin_date = activity_session1.completed_at - 1.days
      end_date = activity_session1.completed_at + 1.days
      results = Scorebook::Query.run(classroom.id, 1, nil, begin_date.to_s, end_date.to_s)
      expect(results.map{|res| res['id']}).to include(activity_session1.id.to_s)
    end

    it 'does not return activities completed after the specified end date' do
      begin_date = activity_session1.completed_at + 1.days
      end_date = activity_session1.completed_at + 2.days
      results = Scorebook::Query.run(classroom.id, 1, nil, begin_date.to_s, end_date.to_s)
      expect(results.map{|res| res['id']}).not_to include(activity_session1.id.to_s)
    end

    it 'does not return activities completed before the specified start date' do
      begin_date = activity_session1.completed_at - 2.days
      end_date = activity_session1.completed_at - 1.days
      results = Scorebook::Query.run(classroom.id, 1, nil, begin_date.to_s, end_date.to_s)
      expect(results.map{|res| res['id']}).not_to include(activity_session1.id.to_s)
    end

    context 'time zones' do
      def activity_session_completed_at_to_time_midnight_minus_offset(activity_session, offset)
        original_completed_at = activity_session.completed_at.to_date.to_s
        new_completed_at = Scorebook::Query.to_offset_datetime(original_completed_at, offset)
        activity_session.update(completed_at: new_completed_at)
        new_completed_at
      end

      it "factors in offset to return activities where the teacher is in a different timezone than the database" do
        tz = TZInfo::Timezone.get('Australia/Perth')
        offset = tz.period_for_utc(Time.new.utc).utc_total_offset
        new_act_sesh_1_completed_at = activity_session_completed_at_to_time_midnight_minus_offset(activity_session1, offset - 1)
        new_act_sesh_2_completed_at = activity_session_completed_at_to_time_midnight_minus_offset(activity_session2, offset + 1)
        activity_session1.update(completed_at: new_act_sesh_1_completed_at)
        activity_session2.update(completed_at: new_act_sesh_2_completed_at)
        begin_date = (activity_session1.reload.completed_at).to_date.to_s
        end_date = begin_date
        results = Scorebook::Query.run(classroom.id, 1, nil, begin_date, end_date, offset)
        expect(results.find{|res| res['id'] == activity_session2.id.to_s}).to be
        expect(results.length).to eq(1)
      end
    end
  end

end
