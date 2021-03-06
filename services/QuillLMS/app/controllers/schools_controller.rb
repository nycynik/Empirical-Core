class SchoolsController < ApplicationController
  include CheckboxCallback

  def index
    if params[:zipcode]
      @schools = School.where(zipcode: params[:zipcode])
    else
      render status: 400, json: {'error' => 'You must enter a zipcode.'}
    end
  end

  def new
  end

  def select_school
    respond_to do |format|
      format.html # select_school.html.erb
      format.json {
        @js_file = 'session'
        #if the school does not specifically have a name, we send the type (e.g. not listed, international, etc..)
        if School.find_by_id(school_params[:school_id_or_type])
          school = School.find(school_params[:school_id_or_type])
        else
          school = School.find_or_create_by(
            name: school_params[:school_id_or_type]
          )
        end
        school_user = SchoolsUsers.find_or_initialize_by(
          user_id: current_user.id
        )
        if school_user.update(school_id: school.id)
          SyncSalesContactWorker.perform_async(current_user.id)
        end
        find_or_create_checkbox('Add School', current_user)
        render json: {}
      }
    end
  end

  private

  def school_params
    params.permit(:school_id_or_type)
  end
end
