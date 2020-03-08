const MAJOR_INDEX = 0;
const MINOR_INDEX = 1;
const PATCH_INDEX = 2;

class SemanticVersion
{
    /**
     * @param {number} major The major version value.
     * @param {number} minor The minor version value.
     * @param {number} patch The patch version value.
     */
    constructor(major = 0, minor = 0, patch = 0)
    {
        this.major = major;
        this.minor = minor;
        this.patch = patch;
    }

    /**
     * Checks whether this version can support the other version. More specfically,
     * it returns true if the other version is newer but within the same major
     * version. Because of how versioning works, order matters!
     * 
     * @param {SemanticVersion|string} otherVersion The version to compare to. If it is a string, it will be parsed into SemanticVersion.
     * @returns {boolean} Whether this version can support the other.
     */
    canSupportVersion(otherVersion)
    {
        if (typeof otherVersion === 'string') otherVersion = SemanticVersion.parse(otherVersion);
        
        return this.major == otherVersion.major &&
            (this.minor < otherVersion.minor ||
                (this.minor == otherVersion.minor && this.patch <= otherVersion.patch));
    }

    toString()
    {
        return this.major + '.' +
            this.minor + '.' +
            this.patch;
    }

    static parse(string)
    {
        if (typeof string != 'string') throw new Error('Invalid argument type to parse as SemanticVersion');

        const components = string.split('.');
        if (components.length != 3) throw new Error('Invalid format for SemanticVersion');

        let major, minor, patch;
        try
        {
            major = Number.parseInt(components[MAJOR_INDEX]);
            minor = Number.parseInt(components[MINOR_INDEX]);
            patch = Number.parseInt(components[PATCH_INDEX]);
        }
        catch (e)
        {
            throw e;
        }

        return new SemanticVersion(major, minor, patch);
    }
}

export default SemanticVersion;
