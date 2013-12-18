class UserMailerWorker
  include Sidekiq::Worker
  sidekiq_options queue: "user_mailer"

  def self.perform(user_id)
    user = User.find_by_id(user_id)
    UserMailer.welcome_email(user).deliver
  end

end
