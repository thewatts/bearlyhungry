require 'test_helper'

class UserTest < ActiveSupport::TestCase

    test "user is saved with correct attributes " do
      user = FactoryGirl.build(:user, full_name: "Antony THEMAN",
                                      email: "asdf@example.com",
                                      password: "password",
                                      password_confirmation: "password",
                                      display_name: "A DAWG")
      assert user.save
    end

    test "user must have full name which is not blank" do
      user1 = FactoryGirl.build(:user, full_name: "")

      refute user1.save
    end

    test "user may have a blank display name" do
      user = FactoryGirl.build(:user, display_name: "")
      assert user.save
    end

    test "user may have display name 32 > size > 2" do
      user1 = FactoryGirl.build(:user, display_name: "A")
      user2 = FactoryGirl.build(:user, display_name: "asdfghjklqwertyuiopzxcvbnmasdfghj")
      user3 = FactoryGirl.build(:user, display_name: "Squeaky")

      refute user1.save
      refute user2.save
      assert user3.save
    end

end
