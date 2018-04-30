class SegmentAnalyticsUserSerializer < UserSerializer
  attributes :email, :created_at, :auditor

  def auditor
    object.flags.include?('auditor')
  end

end
