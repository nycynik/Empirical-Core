class SegmentAnalyticsUserSerializer < UserSerializer
  attributes :email, :created_at, :auditor

  def auditor
    current_user.flags.include?('auditor')
  end

end
