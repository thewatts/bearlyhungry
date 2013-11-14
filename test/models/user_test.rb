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
      refute user1.save
      refute user2.save
    end

    test "user must have an email" do
      user = FactoryGirl.build(:user, email: "")
      refute user.save
    end

    test "user must have a unique email" do
      user  = FactoryGirl.create(:user, email: "asdf@asdf.com")
      user2 = FactoryGirl.build(:user, email: "asdf@asdf.com")
      refute user2.save, "User was saved, when it shouldn't have been"
    end

    test "user must have a password" do
      user = FactoryGirl.build(:user, password: "")
      refute user.valid?
    end

    test "user's password confirmation must match password" do
      user = FactoryGirl.build(:user, password: "asdf",
                                      password_confirmation: "")
      refute user.save
    end

    test "admin status" do
      admin = FactoryGirl.build(:user, admin_status: true)
      non_admin = FactoryGirl.build(:user)
      refute non_admin.admin?
      assert admin.admin?
    end

end
