class ApplicationController < ActionController::Base
   protect_from_forgery

   before_filter :require_login

   private
   	def require_login
   		unless session[:user_id] != nil
   			redirect_to welcome_index_url
   		end
   	end
end
