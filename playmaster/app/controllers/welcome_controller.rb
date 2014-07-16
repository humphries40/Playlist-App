class WelcomeController < ApplicationController

	before_filter :index

   	private
   		def index
   			if session[:user_id] != nil
   				redirect_to user_path(session[:user_id])
   			end
   		end
   		
		skip_before_filter :require_login
end
