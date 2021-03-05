exports.up = function(knex) {
  return knex.schema.createTable("cohort",(table)=>{
      table.increments("id");
      table.string("name"); 
      table.text("members"); 
      table.string("logoUrl");
      table.timestamp("createAt").defaultTo(knex.fn.now()); 
      table.timestamp('updatedAt');
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable("cohort")
};
