class UserCreatorWorker
  @queue = :seed

  def self.perform(num)
    puts "Starting Job for User Creation"
    User.create!(
      :full_name             => "user_number_#{num}",
      :display_name          => "user_#{num}",
      :email                 => "user_#{num}@example.com",
      :password              => "password",
      :password_confirmation => "password"
    )
  end
end
