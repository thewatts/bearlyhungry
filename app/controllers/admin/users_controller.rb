class Admin::UsersController < ApplicationController
  
  layout 'admin'

  def index
    @users = User.select {|user| user.id != current_user.id}
  end

  def edit
    @user = User.find(params[:id])
  end
end
