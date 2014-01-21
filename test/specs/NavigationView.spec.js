define(function(require){
  var NavigationView = require('deck/NavigationView');
  
  describe(NavigationView, function(){
    it('should be defined', function(){
      expect(NavigationView).toBeDefined();
    });

    describe('manual submission', function(){

      describe('when slide is shown', function(){
        it('should have "check" button', function(){
          this.fail('NOT IMPLEMENTED');
        });

        it('"check" button should be disabled', function(){
          this.fail('NOT IMPLEMENTED');
        });
      });

      describe('when answer has been entered', function(){
        it("should have active check button", function(){
          this.fail('NOT IMPLEMENTED');
        });

        it("check button should be disabled if answer is removed", function(){
          this.fail('NOT IMPLEMENTED');
        });
      });

      describe("after answer has been submitted, before result received", function(){
        it("should have 'checking' for button text", function(){
          this.fail('NOT IMPLEMENTED');
        });

        it("button should be disabled", function(){
          this.fail('NOT IMPLEMENTED');
        });
      });

      describe("after result received", function(){
        it("should have 'continue' for button text", function(){
          this.fail('NOT IMPLEMENTED');
        });

        it("button should be enabled", function(){
          this.fail('NOT IMPLEMENTED');
        });
      });
    });

    describe('automatic submission', function(){

      describe('when slide is shown', function(){
        it('should have "check" button', function(){
          this.fail('NOT IMPLEMENTED');
        });

        it('button should be disabled', function(){
          this.fail('NOT IMPLEMENTED');
        });
      });

      describe("after answer has been submitted, before result received", function(){
        it("should have 'checking' for button text", function(){
          this.fail('NOT IMPLEMENTED');
        });

        it("button should be disabled", function(){
          this.fail('NOT IMPLEMENTED');
        });
      });

      describe("after result received", function(){
        it("should have 'continue' for button text", function(){
          this.fail('NOT IMPLEMENTED');
        });

        it("button should be enabled", function(){
          this.fail('NOT IMPLEMENTED');
        });
      });

    });
  });
});
