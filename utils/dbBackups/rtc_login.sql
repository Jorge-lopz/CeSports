CREATE OR REPLACE FUNCTION check_admin_pass(pass TEXT) 
RETURNS BOOLEAN AS $$
DECLARE
    match_count INTEGER;
BEGIN
    -- Count the number of rows where the password matches the input string
    SELECT COUNT(*)
    INTO match_count
    FROM admin_pass
    WHERE password = pass;

    -- Return true if exactly one match is found, false otherwise
    IF match_count = 1 THEN
        RETURN TRUE;
    ELSE
        RETURN FALSE;
    END IF;
END;
$$ LANGUAGE plpgsql;